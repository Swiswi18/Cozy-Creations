// js/includeComponents.js
document.addEventListener("DOMContentLoaded", async () => {
  const loadComponent = async (selector, file) => {
    try {
      const res = await fetch(file);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  };

  await loadComponent("#navbar", "../components/navbar.html");
  await loadComponent("#footer", "../components/footer.html");
});
