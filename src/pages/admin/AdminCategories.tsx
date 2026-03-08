import { mockCategories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info("Add category dialog (demo)")}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Order</TableHead><TableHead className="w-20">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockCategories.map((c) => (
              <TableRow key={c.id}>
                <TableCell><img src={c.image} alt={c.name} className="h-10 w-10 rounded-full object-cover" /></TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.sortOrder}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
