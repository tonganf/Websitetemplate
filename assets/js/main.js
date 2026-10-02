const BASE = import.meta.env.BASE_URL
const BASE_URL = new URL(BASE, window.location.origin)
document.documentElement.classList.add("js")

const services = [
  ["map-2", "Khảo sát địa hình", "dich-vu/khao-sat-dia-hinh/"],
  ["map-pin", "Đo đạc địa chính", "dich-vu/do-dac-dia-chinh/"],
  ["building", "Trắc địa công trình", "dich-vu/trac-dia-cong-trinh/"],
  ["chart-dots", "Quan trắc biến dạng", "dich-vu/quan-trac-bien-dang/"],
  ["scan", "Scan 3D & BIM hiện trạng", "dich-vu/scan-3d-bim-hien-trang/"],
  ["drone", "UAV thành lập bản đồ", "dich-vu/uav-thanh-lap-ban-do/"],
]

const pathFor = (path = "") => {
  const explicitPath = !path || path.endsWith("/") ? `${path}index.html` : path
  return new URL(explicitPath, BASE_URL).href
}
let currentPath = window.location.pathname
const homePath = new URL("index.html", BASE_URL).pathname

const isActive = (segment) =>
  segment === ""
    ? currentPath === homePath
    : currentPath.includes(`/${segment}`)

class IconSvg extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name") || "target"
    this.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <use href="${pathFor("icons/tabler-sprite.svg")}#${name}"></use>
      </svg>`
  }
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const serviceLinks = services
      .map(
        ([icon, label, path]) =>
          `<a href="${pathFor(path)}"><icon-svg name="${icon}"></icon-svg><span>${label}</span></a>`,
      )
      .join("")

    this.innerHTML = `
      <header class="site-header" data-header>
        <div class="container header-inner">
          <a class="brand" href="${pathFor()}" aria-label="LYDVietnam - Trang chủ">
            <span class="brand-mark"><icon-svg name="layers"></icon-svg></span>
            <span>
              <span class="brand-name">LYDVietnam</span>
              <span class="brand-tag">Khảo sát & địa tin học</span>
            </span>
          </a>
          <nav class="desktop-nav" aria-label="Điều hướng chính">
            <a class="nav-link ${
              isActive("") ? "active" : ""
            }" href="${pathFor()}">Trang chủ</a>
            <a class="nav-link ${
              isActive("gioi-thieu") ? "active" : ""
            }" href="${pathFor("gioi-thieu/")}">Về chúng tôi</a>
            <details class="nav-services ${
              isActive("dich-vu") ? "active" : ""
            }">
              <summary>Dịch vụ <icon-svg class="nav-chevron" name="chevron-down"></icon-svg></summary>
              <div class="mega-menu">${serviceLinks}</div>
            </details>
            <a class="nav-link ${
              isActive("du-an") ? "active" : ""
            }" href="${pathFor("du-an/")}">Dự án</a>
            <a class="nav-link ${
              isActive("bai-viet") ? "active" : ""
            }" href="${pathFor("bai-viet/")}">Bài viết</a>
            <a class="nav-link ${
              isActive("lien-he") ? "active" : ""
            }" href="${pathFor("lien-he/")}">Liên hệ</a>
          </nav>
          <div class="header-actions">
            <a class="button header-button" href="${pathFor("lien-he/")}">Nhận tư vấn <icon-svg name="arrow-right"></icon-svg></a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-panel" aria-label="Mở trình đơn">
              <icon-svg name="menu-2"></icon-svg>
            </button>
          </div>
        </div>
        <div class="mobile-panel" id="mobile-panel">
          <nav class="mobile-nav container" aria-label="Điều hướng di động">
            <a href="${pathFor()}"><span>Trang chủ</span><icon-svg name="chevron-right"></icon-svg></a>
            <a href="${pathFor("gioi-thieu/")}"><span>Về chúng tôi</span><icon-svg name="chevron-right"></icon-svg></a>
            <details class="mobile-services">
              <summary><span>Dịch vụ</span><icon-svg name="chevron-down"></icon-svg></summary>
              <div class="mobile-subnav">${serviceLinks}</div>
            </details>
            <a href="${pathFor("du-an/")}"><span>Dự án</span><icon-svg name="chevron-right"></icon-svg></a>
            <a href="${pathFor("bai-viet/")}"><span>Bài viết</span><icon-svg name="chevron-right"></icon-svg></a>
            <a href="${pathFor("lien-he/")}"><span>Liên hệ</span><icon-svg name="chevron-right"></icon-svg></a>
            <a class="button mobile-cta" href="${pathFor("lien-he/")}">Nhận tư vấn khảo sát</a>
          </nav>
        </div>
      </header>`

    const header = this.querySelector("[data-header]")
    const toggle = this.querySelector(".menu-toggle")
    const panel = this.querySelector(".mobile-panel")
    const toggleMenu = (open) => {
      toggle.setAttribute("aria-expanded", String(open))
      toggle.setAttribute(
        "aria-label",
        open ? "Đóng trình đơn" : "Mở trình đơn",
      )
      toggle
        .querySelector("icon-svg")
        .setAttribute("name", open ? "x" : "menu-2")
      toggle.querySelector("icon-svg").connectedCallback()
      panel.classList.toggle("visible", open)
      header.classList.toggle("menu-visible", open)
      document.body.classList.toggle("menu-open", open)
    }

    toggle.addEventListener("click", () => {
      toggleMenu(toggle.getAttribute("aria-expanded") !== "true")
    })
    panel.addEventListener("click", (event) => {
      if (event.target.closest("a")) toggleMenu(false)
    })
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        toggleMenu(false)
        toggle.focus()
      }
    })

    const updateHeader = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 24)
    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <a class="brand" href="${pathFor()}" aria-label="LYDVietnam - Trang chủ">
              <span class="brand-mark"><icon-svg name="layers"></icon-svg></span>
              <span><span class="brand-name">LYDVietnam</span><span class="brand-tag">Khảo sát & địa tin học</span></span>
            </a>
            <p class="footer-about">Đồng hành cùng chủ đầu tư và kỹ sư bằng dữ liệu trắc địa chính xác, minh bạch và sẵn sàng cho mọi quyết định.</p>
          </div>
          <div>
            <h2 class="footer-heading">Khám phá</h2>
            <ul class="footer-list">
              <li><a href="${pathFor("gioi-thieu/")}">Về chúng tôi</a></li>
              <li><a href="${pathFor("dich-vu/")}">Dịch vụ</a></li>
              <li><a href="${pathFor("du-an/")}">Dự án</a></li>
              <li><a href="${pathFor("bai-viet/")}">Bài viết</a></li>
            </ul>
          </div>
          <div>
            <h2 class="footer-heading">Chuyên môn</h2>
            <ul class="footer-list">
              ${services
                .slice(0, 5)
                .map(
                  ([, label, path]) =>
                    `<li><a href="${pathFor(path)}">${label}</a></li>`,
                )
                .join("")}
            </ul>
          </div>
          <div>
            <h2 class="footer-heading">Liên hệ</h2>
            <ul class="footer-list">
              <li>Hà Nội, Việt Nam</li>
              <li>1900 0000 (minh họa)</li>
              <li>lienhe@lydvietnam.vn</li>
              <li><a href="${pathFor("chinh-sach-bao-mat/")}">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>© 2025 LYDVietnam. Thiết kế trình diễn.</p>
          <p>Thông tin doanh nghiệp, dự án và phản hồi đều là dữ liệu minh họa.</p>
        </div>
      </footer>`
  }
}

class ContactCta extends HTMLElement {
  connectedCallback() {
    const service = this.getAttribute("service")
    const href = service
      ? `${pathFor("lien-he/")}?dich-vu=${encodeURIComponent(service)}`
      : pathFor("lien-he/")
    this.innerHTML = `
      <section class="contact-cta">
        <div class="container contact-cta-inner">
          <div>
            <p>Bắt đầu từ một cuộc trao đổi</p>
            <h2>Bạn cần một phương án đo đạc phù hợp với dự án?</h2>
          </div>
          <a class="button button--dark" href="${href}">Gửi thông tin dự án <icon-svg name="arrow-right"></icon-svg></a>
        </div>
      </section>`
  }
}

customElements.define("icon-svg", IconSvg)
customElements.define("site-header", SiteHeader)
customElements.define("site-footer", SiteFooter)
customElements.define("contact-cta", ContactCta)

const topButton = document.createElement("button")
topButton.className = "back-to-top"
topButton.type = "button"
topButton.setAttribute("aria-label", "Lên đầu trang")
topButton.innerHTML = '<icon-svg name="arrow-up"></icon-svg>'
document.body.append(topButton)
topButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
)
const updateTopButton = () =>
  topButton.classList.toggle("visible", window.scrollY > 600)
updateTopButton()
window.addEventListener("scroll", updateTopButton, { passive: true })

function initPageFeatures() {
  const revealItems = document.querySelectorAll("[data-reveal]")
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"))
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.16 },
    )
    revealItems.forEach((item) => revealObserver.observe(item))
  }

  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.dataset.target
    const cards = [...document.querySelectorAll(targetSelector)]
    const empty = document.querySelector(group.dataset.empty || "")
    const search = group.querySelector("[data-search]")
    let activeFilter = "all"

    const update = () => {
      const term = (search?.value || "").trim().toLocaleLowerCase("vi")
      let count = 0
      cards.forEach((card) => {
        const categoryMatch =
          activeFilter === "all" || card.dataset.category === activeFilter
        const searchMatch =
          !term || card.textContent.toLocaleLowerCase("vi").includes(term)
        const visible = categoryMatch && searchMatch
        card.hidden = !visible
        if (visible) count += 1
      })
      empty?.classList.toggle("visible", count === 0)
    }

    group.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter
        group
          .querySelectorAll("[data-filter]")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button)),
          )
        update()
      })
    })
    search?.addEventListener("input", update)
  })

  const contactForm = document.querySelector("[data-contact-form]")
  if (!contactForm) return

  const serviceSelect = contactForm.querySelector('[name="service"]')
  const selectedService = new URLSearchParams(window.location.search).get(
    "dich-vu",
  )
  if (
    selectedService &&
    [...serviceSelect.options].some(
      (option) => option.value === selectedService,
    )
  ) {
    serviceSelect.value = selectedService
  }

  const rules = {
    name: (value) =>
      value.trim().length >= 2 ? "" : "Vui lòng nhập họ và tên.",
    phone: (value) =>
      /^(0|\+84)[0-9]{9,10}$/.test(value.replace(/\s/g, ""))
        ? ""
        : "Vui lòng nhập số điện thoại Việt Nam hợp lệ.",
    email: (value) =>
      !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Email chưa đúng định dạng.",
    service: (value) => (value ? "" : "Vui lòng chọn dịch vụ quan tâm."),
    message: (value) =>
      value.trim().length >= 10 ? "" : "Vui lòng mô tả tối thiểu 10 ký tự.",
    consent: (_, field) =>
      field.checked ? "" : "Vui lòng đồng ý để chúng tôi liên hệ lại.",
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let firstInvalid
    Object.entries(rules).forEach(([name, validate]) => {
      const field = contactForm.elements[name]
      const message = validate(field.value, field)
      const error = contactForm.querySelector(`#${name}-error`)
      field.setAttribute("aria-invalid", String(Boolean(message)))
      if (error) error.textContent = message
      if (message && !firstInvalid) firstInvalid = field
    })
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }
    contactForm.hidden = true
    document.querySelector("[data-success]").classList.add("visible")
  })

  document.querySelector("[data-reset-form]")?.addEventListener("click", () => {
    contactForm.reset()
    contactForm.hidden = false
    document.querySelector("[data-success]").classList.remove("visible")
    contactForm.querySelector('[name="name"]').focus()
  })
}

function updateActiveNavigation(pathname) {
  document.querySelectorAll(".desktop-nav .nav-link").forEach((link) => {
    const linkPath = new URL(link.href).pathname
    const segment = linkPath.split("/").filter(Boolean)[0]
    link.classList.toggle(
      "active",
      linkPath === homePath
        ? pathname === homePath
        : Boolean(segment && pathname.includes(`/${segment}/`)),
    )
  })
  document
    .querySelector(".desktop-nav .nav-services")
    ?.classList.toggle("active", pathname.includes("/dich-vu/"))
}

let navigationInProgress = false
async function navigateWithinPreview(destination, pushState = true) {
  if (navigationInProgress) return
  navigationInProgress = true
  document.documentElement.classList.add("is-navigating")

  try {
    const response = await fetch(destination.href, {
      headers: { "X-LYDVietnam-Navigation": "true" },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const nextDocument = new DOMParser().parseFromString(
      await response.text(),
      "text/html",
    )
    const nextMain = nextDocument.querySelector("main")
    const currentMain = document.querySelector("main")
    if (!nextMain || !currentMain)
      throw new Error("Trang không có nội dung chính")

    currentMain.replaceWith(document.importNode(nextMain, true))
    document.title = nextDocument.title
    const nextDescription = nextDocument.querySelector(
      'meta[name="description"]',
    )?.content
    if (nextDescription) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", nextDescription)
    }

    if (pushState) history.pushState({}, "", destination.href)
    currentPath = destination.pathname
    updateActiveNavigation(currentPath)
    initPageFeatures()
    window.scrollTo({ top: 0, behavior: "instant" })
  } catch (error) {
    console.error("Không thể chuyển trang nội bộ:", error)
    window.location.assign(destination.href)
  } finally {
    navigationInProgress = false
    document.documentElement.classList.remove("is-navigating")
  }
}

// Soft navigation prevents the preview shell from rewriting nested multi-page
// URLs back to the home page. Every destination remains a physical HTML file.
document.addEventListener(
  "click",
  (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return
    }

    const anchor = event.target.closest("a[href]")
    if (
      !anchor ||
      anchor.target === "_blank" ||
      anchor.hasAttribute("download")
    )
      return

    const destination = new URL(anchor.href, window.location.href)
    const sameDocumentHash =
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search &&
      destination.hash
    if (destination.origin !== window.location.origin || sameDocumentHash)
      return

    event.preventDefault()
    navigateWithinPreview(destination)
  },
  true,
)

window.addEventListener("popstate", () =>
  navigateWithinPreview(new URL(window.location.href), false),
)

initPageFeatures()
