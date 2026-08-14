#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'

ROOT = File.expand_path('..', __dir__)
DATA_DIR = File.join(ROOT, '_data')
SLUG_PATTERN = /\A[a-z]+(-[a-z]+)*\z/.freeze
LANGUAGES = %w[fr en].freeze
VALID_GENDERS = %w[masculine feminine].freeze
LABEL_FORMS = %w[masculine feminine neutral].freeze
REVERSE_LABEL_FORMS = %w[masculine feminine].freeze

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

  check_gendered_label(type['label'], 'label', slug, file, LABEL_FORMS)
  check_gendered_label(type['reverse-label'], 'reverse-label', slug, file, REVERSE_LABEL_FORMS)
end

def check_gendered_label(label, field_name, slug, file, required_forms)
  return unless label

  LANGUAGES.each do |lang|
    forms = label[lang]
    next if forms.is_a?(Hash) && required_forms.all? { |form| !forms[form].nil? }

    error(file, 'gendered-label-incomplete',
          "type '#{slug}' #{field_name} for lang '#{lang}' must define #{required_forms.map { |f| "'#{f}'" }.join(', ')} forms")
  end
end

def record_relation_type(registry, type, file)
  register_type(registry, type, file)
  check_relation_type(type, file)
end

def check_metadata_key(key, file)
  slug = key['slug']
  if slug.nil?
    error(file, 'metadata-key-slug-missing', 'metadata key entry has no slug')
    return
  end

  unless valid_slug?(slug)
    error(file, 'slug-format', "metadata key slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
  end

  check_metadata_label(key['label'], slug, file)
end

def check_metadata_label(label, slug, file)
  check_localized_field(label, 'metadata key', 'label', slug, file,
                         'metadata-key-label-missing', 'metadata-key-label-incomplete')
end

# Shared by check_metadata_label above and the group `name` check below: both are
# a simple "present for every declared language" field, unlike a relation type's
# label/reverse-label, which also declines masculine/feminine (see check_gendered_label).
def check_localized_field(value, entity_label, field_name, slug, file, missing_rule, incomplete_rule)
  if value.nil?
    error(file, missing_rule, "#{entity_label} '#{slug}' has no #{field_name}")
    return
  end

  LANGUAGES.each do |lang|
    next unless value[lang].nil?

    error(file, incomplete_rule, "#{entity_label} '#{slug}' #{field_name} for lang '#{lang}' is missing")
  end
end

# Shared by the two character metadata-locality checks below (characters.yml entries expect
# localized: false, front matter entries expect localized: true): same rule, checked from
# both directions against the same taxonomy. `subject`, when given, prefixes messages with
# the character they're about (needed for characters.yml, a single file shared by every
# character; front matter files don't need it, their own filename already says which one).
def check_metadata_locality(metadata, known_metadata_keys, file, expected_localized, subject: nil)
  prefix = subject ? "#{subject} " : ''
  (metadata || {}).each_key do |key|
    taxonomy_key = known_metadata_keys[key]
    unless taxonomy_key
      error(file, 'unknown-metadata-key',
            "#{prefix}metadata key '#{key}' is not defined in metadata-keys.yml or additional-metadata-keys.yml")
      next
    end

    actual_localized = !!taxonomy_key['localized']
    next if actual_localized == expected_localized

    current_location = expected_localized ? 'the front matter' : 'characters.yml'
    correct_location = expected_localized ? 'characters.yml' : 'the front matter'
    error(file, 'metadata-key-locality-mismatch',
          "#{prefix}metadata key '#{key}' is declared localized: #{actual_localized} and must be in #{correct_location}, not #{current_location}")
  end
end

def record_metadata_key(registry, key, file)
  register_type(registry, key, file)
  check_metadata_key(key, file)
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

# --- Metadata keys (common + per-universe additional) --------------------

common_metadata_keys_path = File.join(DATA_DIR, 'metadata-keys.yml')
common_metadata_keys_file_rel = relative(common_metadata_keys_path)
common_metadata_keys = []
if File.exist?(common_metadata_keys_path)
  common_metadata_keys = load_yaml(common_metadata_keys_path) || []
else
  error(common_metadata_keys_file_rel, 'missing-file', 'common metadata keys file not found')
end

metadata_key_registry = {}
common_metadata_keys.each { |key| record_metadata_key(metadata_key_registry, key, common_metadata_keys_file_rel) }

common_known_metadata_keys = {}
common_metadata_keys.each { |k| common_known_metadata_keys[k['slug']] = k if k['slug'] }

universe_additional_metadata_keys = {}
universe_slugs.each do |uslug|
  additional_path = File.join(DATA_DIR, uslug, 'additional-metadata-keys.yml')
  next unless File.exist?(additional_path)

  file_rel = "_data/#{uslug}/additional-metadata-keys.yml"
  keys = load_yaml(additional_path) || []
  local_keys = {}
  keys.each do |key|
    record_metadata_key(metadata_key_registry, key, file_rel)
    local_keys[key['slug']] = key if key['slug']
  end
  universe_additional_metadata_keys[uslug] = local_keys
end

metadata_key_registry.each do |slug, files|
  if files.size > 1
    error(files.uniq.join(', '), 'metadata-key-slug-unique', "metadata key slug '#{slug}' is declared more than once")
  end
end

# --- Source types (common only, no per-universe extension) ---------------

common_source_types_path = File.join(DATA_DIR, 'source-types.yml')
common_source_types_file_rel = relative(common_source_types_path)
common_source_types = []
if File.exist?(common_source_types_path)
  common_source_types = load_yaml(common_source_types_path) || []
else
  error(common_source_types_file_rel, 'missing-file', 'common source types file not found')
end

known_source_types = {}
source_type_registry = {}
common_source_types.each do |source_type|
  slug = source_type['slug']
  if slug.nil?
    error(common_source_types_file_rel, 'source-type-slug-missing', 'source type entry has no slug')
    next
  end

  unless valid_slug?(slug)
    error(common_source_types_file_rel, 'slug-format', "source type slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
  end

  (source_type_registry[slug] ||= []) << common_source_types_file_rel
  known_source_types[slug] = source_type

  check_localized_field(source_type['label'], 'source type', 'label', slug, common_source_types_file_rel,
                         'source-type-label-missing', 'source-type-label-incomplete')
end

source_type_registry.each do |slug, files|
  if files.size > 1
    error(files.uniq.join(', '), 'source-type-slug-unique', "source type slug '#{slug}' is declared more than once")
  end
end

# --- Per-universe content ------------------------------------------------

universe_slugs.each do |uslug|
  universe_dir = File.join(ROOT, uslug)
  unless Dir.exist?(universe_dir)
    error("#{uslug}/", 'missing-universe-directory', "no content directory found for universe '#{uslug}' (declared via _data/#{uslug}/)")
    next
  end

  # universe.yml: the universe's own non-localized attribute (source-type)
  universe_yml_path = File.join(DATA_DIR, uslug, 'universe.yml')
  universe_yml_file_rel = "_data/#{uslug}/universe.yml"
  if File.exist?(universe_yml_path)
    universe_data = load_yaml(universe_yml_path) || {}
    source_type = universe_data['source-type']
    if source_type.nil?
      error(universe_yml_file_rel, 'source-type-missing', 'universe has no source-type')
    elsif !known_source_types.key?(source_type)
      error(universe_yml_file_rel, 'unknown-source-type', "source-type '#{source_type}' is not defined in source-types.yml")
    end
  else
    error(universe_yml_file_rel, 'missing-file', 'universe.yml not found')
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

  # characters.yml: non-localized attributes (gender, group, portrait-source, non-localized
  # metadata), one entry per character, cross-checked against the character files found above.
  characters_yml_path = File.join(DATA_DIR, uslug, 'characters.yml')
  characters_yml_file_rel = "_data/#{uslug}/characters.yml"
  shared_data = {} # slug => entry
  if File.exist?(characters_yml_path)
    entries = load_yaml(characters_yml_path) || []
    entries.each do |entry|
      slug = entry['slug']
      if slug.nil?
        error(characters_yml_file_rel, 'character-slug-missing', 'character entry has no slug')
        next
      end

      unless valid_slug?(slug)
        error(characters_yml_file_rel, 'slug-format', "character slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
      end

      if shared_data.key?(slug)
        error(characters_yml_file_rel, 'character-slug-unique', "character slug '#{slug}' is declared more than once")
      end
      shared_data[slug] = entry

      unless char_data.key?(slug)
        error(characters_yml_file_rel, 'unknown-character', "character '#{slug}' has no characters/#{slug}.*.md file")
      end
    end
  elsif !char_data.empty?
    error(characters_yml_file_rel, 'missing-file', 'characters.yml not found')
  end

  char_data.each_key do |cslug|
    next if shared_data.key?(cslug)

    error("#{uslug}/characters/#{cslug}.*.md", 'missing-characters-yml-entry',
          "character '#{cslug}' has no entry in #{characters_yml_file_rel}")
  end

  # gender: must be masculine/feminine when present (single value, in characters.yml)
  shared_data.each do |cslug, entry|
    next unless entry.key?('gender')

    gender = entry['gender']
    next if VALID_GENDERS.include?(gender)

    error(characters_yml_file_rel, 'invalid-gender',
          "character '#{cslug}' gender #{gender.inspect} must be 'masculine' or 'feminine'")
  end

  # metadata: keys used by a character (in characters.yml or front matter) must exist in the
  # taxonomy, and must be declared in the location matching their `localized` flag.
  known_metadata_keys = common_known_metadata_keys.merge(universe_additional_metadata_keys[uslug] || {})

  shared_data.each do |cslug, entry|
    check_metadata_locality(entry['metadata'], known_metadata_keys, characters_yml_file_rel, false,
                             subject: "character '#{cslug}'")
  end

  char_data.each do |cslug, langs|
    langs.each do |lang, fm|
      file_ref = "#{uslug}/characters/#{cslug}.#{lang}.md"
      check_metadata_locality(fm['metadata'], known_metadata_keys, file_ref, true)
    end
  end

  # groups: no common taxonomy (see "Groupe" in data-model.md), so slug uniqueness
  # is checked within this universe's own groups.yml only, not globally.
  groups_path = File.join(DATA_DIR, uslug, 'groups.yml')
  known_groups = {}
  if File.exist?(groups_path)
    groups_file_rel = "_data/#{uslug}/groups.yml"
    groups = load_yaml(groups_path) || []

    groups.each do |group|
      slug = group['slug']
      if slug.nil?
        error(groups_file_rel, 'group-slug-missing', 'group entry has no slug')
        next
      end

      unless valid_slug?(slug)
        error(groups_file_rel, 'slug-format', "group slug '#{slug}' must contain only lowercase ASCII letters and hyphens")
      end

      if known_groups.key?(slug)
        error(groups_file_rel, 'group-slug-unique', "group slug '#{slug}' is declared more than once")
      end
      known_groups[slug] = group

      check_localized_field(group['name'], 'group', 'name', slug, groups_file_rel,
                             'group-name-missing', 'group-name-incomplete')
    end
  end

  # group: a character's group attribute (in characters.yml), when present, must reference
  # a group of its own universe
  shared_data.each do |cslug, entry|
    group = entry['group']
    next if group.nil?
    next if known_groups.key?(group)

    error(characters_yml_file_rel, 'unknown-group',
          "character '#{cslug}' group '#{group}' is not defined in _data/#{uslug}/groups.yml")
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
