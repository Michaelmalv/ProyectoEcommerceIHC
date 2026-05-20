import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function PrivacySettingsPage() {
  const handleSave = () => {
    alert("Configuración de privacidad guardada (simulado)");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-4">Configuración de privacidad</h1>
        <p className="mb-4">Controla cómo se utiliza tu información.</p>
        <div className="space-y-4">
          <p>Opciones básicas de privacidad (simulado).</p>
          <Button className="bg-black text-white" onClick={handleSave}>Guardar</Button>
        </div>
      </Card>
    </div>
  );
}
