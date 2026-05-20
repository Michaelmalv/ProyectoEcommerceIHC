import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";

export function NotificationPreferencesPage() {
  const [emailPref, setEmailPref] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-4">Preferencias de notificaciones</h1>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <Checkbox checked={emailPref} onCheckedChange={(v) => setEmailPref(Boolean(v))} />
            <span>Email: Recibir novedades y estado de pedidos</span>
          </label>
          {saved && <p className="text-sm text-green-700">Preferencias guardadas</p>}
          <Button className="bg-black text-white" onClick={handleSave}>Guardar preferencias</Button>
        </div>
      </Card>
    </div>
  );
}
