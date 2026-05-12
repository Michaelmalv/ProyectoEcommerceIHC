import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await register({ email, password, fullName, phone });
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card className="p-8 border-2">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a CrowStore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="font-bold">
              Nombre Completo <span className="text-red-600">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="border-2 focus:ring-2 focus:ring-black"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="email" className="font-bold">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="border-2 focus:ring-2 focus:ring-black"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="font-bold">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="border-2 focus:ring-2 focus:ring-black"
              placeholder="+593 999 999 999"
            />
          </div>

          <div>
            <Label htmlFor="password" className="font-bold">
              Contraseña <span className="text-red-600">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="border-2 focus:ring-2 focus:ring-black"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="font-bold">
              Confirmar Contraseña <span className="text-red-600">*</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="border-2 focus:ring-2 focus:ring-black"
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-300 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </Card>
    </div>
  );
}
