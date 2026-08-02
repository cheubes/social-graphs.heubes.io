document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("sg-character-modal");
  if (!modalEl) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const modalContent = document.getElementById("sg-character-modal-content");
  const viewUrl = new URL(modalEl.dataset.viewUrl, window.location.origin).href;
  const loadingText = modalEl.dataset.loadingText || "";
  const errorText = modalEl.dataset.errorText || "";
  const baseTitle = document.title;

  function showLoadingState() {
    modalContent.innerHTML =
      '<div class="sg-character-modal-loading" role="status">' +
      '<div class="spinner-border" aria-hidden="true"></div>' +
      '<span class="visually-hidden">' + loadingText + "</span>" +
      "</div>";
  }

  function showErrorState() {
    modalContent.innerHTML = '<p class="sg-character-modal-error">' + errorText + "</p>";
  }

  function extractModalContent(html) {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const content = parsed.getElementById("sg-character-modal-content");
    const titleEl = parsed.querySelector("title");
    return {
      html: content ? content.innerHTML : "",
      title: titleEl ? titleEl.textContent : baseTitle,
    };
  }

  function openCharacter(url, pushState) {
    showLoadingState();
    modal.show();
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.text();
      })
      .then((html) => {
        const extracted = extractModalContent(html);
        modalContent.innerHTML = extracted.html;
        document.title = extracted.title;
        if (pushState) {
          history.pushState({}, "", url);
        }
      })
      .catch(() => {
        showErrorState();
      });
  }

  document.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest(".sg-character-link");
    if (!link) return;
    event.preventDefault();
    openCharacter(link.href, true);
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    if (window.location.href !== viewUrl) {
      history.pushState({}, "", viewUrl);
    }
    document.title = baseTitle;
  });

  window.addEventListener("popstate", () => {
    if (window.location.href === viewUrl) {
      modal.hide();
    } else {
      openCharacter(window.location.href, false);
    }
  });

  if (modalEl.dataset.open === "true") {
    modal.show();
  }
});
