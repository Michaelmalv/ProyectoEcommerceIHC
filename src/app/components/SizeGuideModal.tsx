"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
};

export default function SizeGuideModal({ open, onOpenChange, category }: Props) {
  const renderCamisetas = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Talla</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Pecho</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Largo</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Hombros</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["XS", "84-88", "60-62", "38-40"],
            ["S", "89-94", "63-65", "41-42"],
            ["M", "95-100", "66-68", "43-44"],
            ["L", "101-106", "69-71", "45-46"],
            ["XL", "107-113", "72-74", "47-48"],
            ["XXL", "114-120", "75-77", "49-50"],
          ].map((row) => (
            <tr key={row[0]} className="odd:bg-white even:bg-gray-50">
              <td className="border-b border-gray-200 px-3 py-2 font-bold">{row[0]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[1]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[2]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPantalones = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Talla</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Cintura</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Cadera</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Tiro</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Largo</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["XS", "64-68", "88-92", "24-25", "98-100"],
            ["S", "69-73", "93-97", "25-26", "100-102"],
            ["M", "74-78", "98-102", "26-27", "102-104"],
            ["L", "79-85", "103-109", "27-28", "104-106"],
            ["XL", "86-92", "110-116", "28-29", "106-108"],
            ["XXL", "93-100", "117-124", "29-30", "108-110"],
          ].map((row) => (
            <tr key={row[0]} className="odd:bg-white even:bg-gray-50">
              <td className="border-b border-gray-200 px-3 py-2 font-bold">{row[0]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[1]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[2]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[3]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVestidos = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Talla</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Pecho</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Cintura</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Cadera</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Largo</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["XS", "80-84", "62-66", "88-92", "82-84"],
            ["S", "85-89", "67-71", "93-97", "84-86"],
            ["M", "90-94", "72-76", "98-102", "86-88"],
            ["L", "95-101", "77-83", "103-109", "88-90"],
            ["XL", "102-108", "84-90", "110-116", "90-92"],
            ["XXL", "109-116", "91-98", "117-124", "92-94"],
          ].map((row) => (
            <tr key={row[0]} className="odd:bg-white even:bg-gray-50">
              <td className="border-b border-gray-200 px-3 py-2 font-bold">{row[0]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[1]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[2]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[3]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOtras = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Talla</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Pecho</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Largo</th>
            <th className="border-b-2 border-gray-300 px-3 py-2 text-left">Manga</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["S", "92-96", "66-68", "61-62"],
            ["M", "97-102", "68-70", "63-64"],
            ["L", "103-108", "70-72", "65-66"],
            ["XL", "109-114", "72-74", "67-68"],
          ].map((row) => (
            <tr key={row[0]} className="odd:bg-white even:bg-gray-50">
              <td className="border-b border-gray-200 px-3 py-2 font-bold">{row[0]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[1]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[2]}</td>
              <td className="border-b border-gray-200 px-3 py-2">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const normalized = category?.toLowerCase() || "";

  const content =
    normalized === "pantalones"
      ? renderPantalones()
      : normalized === "vestidos"
      ? renderVestidos()
      : normalized === "camisetas" || normalized === "polos"
      ? renderCamisetas()
      : renderOtras();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Guía de tallas</DialogTitle>
        <DialogDescription className="mb-4">
          Consulta las medidas recomendadas para la prenda seleccionada.
        </DialogDescription>

        {content}
      </DialogContent>
    </Dialog>
  );
}
