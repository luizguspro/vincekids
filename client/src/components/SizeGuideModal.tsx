import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROWS = [
  { size: "1", age: "12-18 meses", height: "82-88", chest: "50", waist: "48" },
  { size: "2", age: "18-24 meses", height: "88-98", chest: "52", waist: "50" },
  { size: "3", age: "3 anos", height: "98-105", chest: "54", waist: "52" },
  { size: "4", age: "4 anos", height: "105-117", chest: "56", waist: "54" },
  { size: "6", age: "5-6 anos", height: "117-128", chest: "60", waist: "56" },
  { size: "8", age: "7-8 anos", height: "128-137", chest: "64", waist: "59" },
  { size: "10", age: "9-10 anos", height: "137-147", chest: "68", waist: "62" },
];

export default function SizeGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-primary border-dashed text-xs sm:text-sm"
        >
          <Ruler className="h-4 w-4" />
          Medidas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl sm:text-3xl text-primary text-center mb-2 sm:mb-4">
            Guia de Medidas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            Use uma fita métrica para medir seu pequeno e compare com a tabela abaixo. As medidas
            são aproximadas e podem variar até 2cm.
          </p>

          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="text-center font-bold text-primary text-xs sm:text-sm">Tam.</TableHead>
                  <TableHead className="text-center font-bold text-primary text-xs sm:text-sm">Idade</TableHead>
                  <TableHead className="text-center font-bold text-primary text-xs sm:text-sm">Altura (cm)</TableHead>
                  <TableHead className="text-center font-bold text-primary text-xs sm:text-sm">Tórax</TableHead>
                  <TableHead className="text-center font-bold text-primary text-xs sm:text-sm">Cintura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((row) => (
                  <TableRow key={row.size} className="hover:bg-secondary/5">
                    <TableCell className="text-center font-bold text-foreground text-xs sm:text-sm">{row.size}</TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">{row.age}</TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">{row.height}</TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">{row.chest}</TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">{row.waist}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-amber-50 p-3 sm:p-4 rounded-xl border border-amber-100 text-center">
            <p className="text-xs sm:text-sm text-amber-800">
              <strong>Dica:</strong> Na dúvida entre dois tamanhos, opte sempre pelo maior para
              garantir o conforto e maior tempo de uso.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
