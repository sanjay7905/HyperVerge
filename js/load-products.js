
(async function () {
  if (!localStorage.getItem("products")) {
    try {
      const response = await fetch("../data/product.json");
      if (!response.ok) throw new Error("Failed to load product.json");
      const data = await response.json();
      localStorage.setItem("products", JSON.stringify(data));
      console.log("Products loaded from product.json into localStorage");
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }
  window.getAllProducts = function () {
    return JSON.parse(localStorage.getItem("products") || "[]");
  };

  window.saveProducts = function (products) {
    localStorage.setItem("products", JSON.stringify(products));
  };
})();
