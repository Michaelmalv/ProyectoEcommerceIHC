import { products } from "./src/app/data/products.ts";

const ADMIN_KEY = Deno.env.get("ADMIN_KEY") || "your-admin-key";
const SERVER_URL = Deno.env.get("SERVER_URL") || "http://localhost:8000";

async function syncProducts() {
  try {
    const response = await fetch(
      `${SERVER_URL}/make-server-69259dc0/admin/products/replace`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ products }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error:", data);
      Deno.exit(1);
    }

    console.log("✅ Productos sincronizados exitosamente!");
    console.log(`📦 ${data.inserted} productos insertados en la base de datos`);
  } catch (error) {
    console.error("❌ Error al sincronizar:", error.message);
    Deno.exit(1);
  }
}

syncProducts();
