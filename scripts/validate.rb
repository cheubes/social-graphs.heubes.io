#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'

ROOT = File.expand_path('..', __dir__)
DATA_DIR = File.join(ROOT, '_data')
SLUG_PATTERN = /\A[a-z]+(-[a-z]+)*\z/.freeze
LANGUAGES = %w[fr en].freeze
VALID_GENDERS = %w[masculine feminine].freeze

Issue = Struct.new(:severity, :file, :rule, :detail)

$issues = []

def error(file, rule, detail)
  $issues << Issue.new(:error, file, rule, detail)
end

def warning(file, rule, detail)
  $issues << Issue.new(:warning, file, rule, detail)
end

def relative(path)
  path.sub("#{ROOT}/", '')
end

def valid_slug?(slug)
  slug.is_a?(String) && slug.match?(SLUG_PATTERN)
end

def load_yaml(path)
  YAML.safe_load_file(path)
rescue Psych::SyntaxError => e
  error(relative(path), 'yaml-syntax', "invalid YAML (#{e.message})")
  nil
end

def front_matter(path)
  content = File.read(path)
  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  unless match
    error(relative(path), 'front-matter', 'no YAML front matter found')
    return {}
  end
  YAML.safe_load(match[1]) || {}
rescue Psych::SyntaxError => e
  error(relative(path), 'yaml-syntax', "invalid YAML front matter (#{e.message})")
  {}
end

def check_lang(fm, lang, file_ref)
  return if fm['lang'] == lang

  error(file_ref, 'lang-mismatch', "front matter lang is #{fm['lang'].inspect}, expected '#{lang}'")
end

def register_type(registry, type, file)
  slug = type['slug']
  return unless slug

  (registry[slug] ||= []) << file
end

def check_relation_type(type, file)
  slug = type['slug']
  if slug.nil?
    error(file, 'relation-type-slug-missing', 'relation type entry has no slug')
    return
  end

  unless valid_slug?(slug)
    error(file, 'slug-format', "relation type slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
  end

  directed = type['directed']
  has_reverse = !type['reverse-label'].nil?
  if directed && !has_reverse
    error(file, 'reverse-label-consistency', "type '#{slug}' is directed but defines no reverse-label")
  elsif !directed && has_reverse
    error(file, 'reverse-label-consistency', "type '#{slug}' is not directed but defines a reverse-label")
  end

  check_gendered_label(type['label'], 'label', slug, file)
  check_gendered_label(type['reverse-label'], 'reverse-label', slug, file)
end

def check_gendered_label(label, field_name, slug, file)
  return unless label

  LANGUAGES.each do |lang|
    forms = label[lang]
    next if forms.is_a?(Hash) && !forms['masculine'].nil? && !forms['feminine'].nil?

    error(file, 'gendered-label-incomplete',
          "type '#{slug}' #{field_name} for lang '#{lang}' must define both 'masculine' and 'feminine' forms")
  end
end

def record_relation_type(registry, type, file)
  register_type(registry, type, file)
  check_relation_type(type, file)
end

# --- Universe discovery -----------------------------------------------
# A universe is identified by its `_data/<slug>/` directory.

universe_slugs = Dir.exist?(DATA_DIR) ? Dir.children(DATA_DIR).select { |e| File.directory?(File.join(DATA_DIR, e)) }.sort : []

universe_slugs.each do |slug|
  unless valid_slug?(slug)
    error("_data/#{slug}", 'slug-format', "universe slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
  end
end

# --- Relation types (common + per-universe additional) -----------------

common_types_path = File.join(DATA_DIR, 'relation-types.yml')
common_types_file_rel = relative(common_types_path)
common_types = []
if File.exist?(common_types_path)
  common_types = load_yaml(common_types_path) || []
else
  error(common_types_file_rel, 'missing-file', 'common relation types file not found')
end

type_registry = {}
common_types.each { |type| record_relation_type(type_registry, type, common_types_file_rel) }

common_known_types = {}
common_types.each { |t| common_known_types[t['slug']] = t if t['slug'] }

universe_additional_types = {}
universe_slugs.each do |uslug|
  additional_path = File.join(DATA_DIR, uslug, 'additional-relation-types.yml')
  next unless File.exist?(additional_path)

  file_rel = "_data/#{uslug}/additional-relation-types.yml"
  types = load_yaml(additional_path) || []
  local_types = {}
  types.each do |type|
    record_relation_type(type_registry, type, file_rel)
    local_types[type['slug']] = type if type['slug']
  end
  universe_additional_types[uslug] = local_types
end

type_registry.each do |slug, files|
  if files.size > 1
    error(files.uniq.join(', '), 'relation-type-slug-unique', "relation type slug '#{slug}' is declared more than once")
  end
end

# --- Per-universe content ------------------------------------------------

universe_slugs.each do |uslug|
  universe_dir = File.join(ROOT, uslug)
  unless Dir.exist?(universe_dir)
    error("#{uslug}/", 'missing-universe-directory', "no content directory found for universe '#{uslug}' (declared via _data/#{uslug}/)")
    next
  end

  # mosaic/graph presence pairing and lang consistency, per language
  LANGUAGES.each do |lang|
    paths = { 'mosaic' => File.join(universe_dir, "mosaic.#{lang}.md"), 'graph' => File.join(universe_dir, "graph.#{lang}.md") }
    exists = paths.transform_values { |path| File.exist?(path) }

    if exists['mosaic'] != exists['graph']
      missing = exists['mosaic'] ? 'graph' : 'mosaic'
      error("#{uslug}/", 'mosaic-graph-pairing', "#{missing}.#{lang}.md is missing for lang '#{lang}'")
    end

    paths.each do |kind, path|
      next unless exists[kind]

      check_lang(front_matter(path), lang, "#{uslug}/#{kind}.#{lang}.md")
    end
  end

  # characters
  characters_dir = File.join(universe_dir, 'characters')
  char_files = Dir.exist?(characters_dir) ? Dir.children(characters_dir) : []
  char_filename_pattern = /\A(.+)\.(#{LANGUAGES.join('|')})\.md\z/

  char_data = {} # slug => { 'fr' => front_matter, 'en' => front_matter }
  char_files.each do |fname|
    next unless fname =~ char_filename_pattern

    cslug = Regexp.last_match(1)
    lang = Regexp.last_match(2)

    unless valid_slug?(cslug)
      error("#{uslug}/characters/#{fname}", 'slug-format', "character slug '#{cslug}' must contain only lowercase ASCII letters and hyphens")
    end

    fm = front_matter(File.join(characters_dir, fname))
    check_lang(fm, lang, "#{uslug}/characters/#{fname}")

    char_data[cslug] ||= {}
    char_data[cslug][lang] = fm
  end

  # gender: must be masculine/feminine when present, and identical across languages
  char_data.each do |cslug, langs|
    langs.each do |lang, fm|
      next unless fm.key?('gender')

      gender = fm['gender']
      next if VALID_GENDERS.include?(gender)

      error("#{uslug}/characters/#{cslug}.#{lang}.md", 'invalid-gender',
            "gender #{gender.inspect} must be 'masculine' or 'feminine'")
    end

    next unless langs['fr'] && langs['en']

    gender_fr = langs['fr']['gender']
    gender_en = langs['en']['gender']
    next if gender_fr == gender_en

    error("#{uslug}/characters/#{cslug}.{fr,en}.md", 'gender-locale-consistency',
          "gender differs between languages (fr: #{gender_fr.inspect}, en: #{gender_en.inspect})")
  end

  # metadata: non-localized fields should match across languages (warning only)
  char_data.each do |cslug, langs|
    next unless langs['fr'] && langs['en']

    meta_fr = langs['fr']['metadata'] || {}
    meta_en = langs['en']['metadata'] || {}
    (meta_fr.keys & meta_en.keys).each do |key|
      next if meta_fr[key] == meta_en[key]

      warning("#{uslug}/characters/#{cslug}.{fr,en}.md", 'metadata-locale-consistency',
              "metadata key '#{key}' differs between languages (fr: #{meta_fr[key].inspect}, en: #{meta_en[key].inspect})")
    end
  end

  # relations
  relations_path = File.join(DATA_DIR, uslug, 'relations.yml')
  next unless File.exist?(relations_path)

  relations_file_rel = "_data/#{uslug}/relations.yml"
  parsed = load_yaml(relations_path)
  relations = parsed.is_a?(Hash) ? (parsed['relations'] || []) : []

  known_types = common_known_types.merge(universe_additional_types[uslug] || {})

  seen = {}
  relations.each_with_index do |rel, idx|
    file_ref = "#{relations_file_rel}##{idx}"
    source = rel['source-character']
    target = rel['target-character']
    type_slug = rel['type']

    if source == target
      error(file_ref, 'self-relation', "character '#{source}' cannot be in a relation with itself")
    end

    error(file_ref, 'unknown-character', "source-character '#{source}' does not exist in universe '#{uslug}'") unless char_data.key?(source)
    error(file_ref, 'unknown-character', "target-character '#{target}' does not exist in universe '#{uslug}'") unless char_data.key?(target)

    type = known_types[type_slug]
    error(file_ref, 'unknown-relation-type', "relation type '#{type_slug}' is not defined in relation-types.yml or additional-relation-types.yml") unless type

    directed = type ? type['directed'] : false
    key = directed ? [source, target, type_slug] : [[source, target].sort, type_slug]
    if seen[key]
      error(file_ref, 'duplicate-relation', "duplicate relation between '#{source}' and '#{target}' of type '#{type_slug}'")
    else
      seen[key] = true
    end
  end
end

# --- Report ---------------------------------------------------------------

errors = $issues.select { |i| i.severity == :error }
warnings = $issues.select { |i| i.severity == :warning }

def print_issues(title, issues)
  return if issues.empty?

  puts title
  issues.each do |i|
    puts "  [#{i.rule}] #{i.file}: #{i.detail}"
  end
  puts
end

print_issues("Errors (#{errors.size}):", errors)
print_issues("Warnings (#{warnings.size}):", warnings)

if errors.empty?
  suffix = warnings.empty? ? '' : " (#{warnings.size} warning(s))"
  puts "OK: no errors found#{suffix}."
else
  puts "FAILED: #{errors.size} error(s) found."
end

exit(errors.empty? ? 0 : 1)
