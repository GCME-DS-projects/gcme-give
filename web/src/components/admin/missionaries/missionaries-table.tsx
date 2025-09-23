import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Missionary } from "@/lib/types";
import { Edit, Eye, Mail, Phone, Trash2 } from "lucide-react";

interface Props {
  missionaries: Missionary[];
  onView: (m: Missionary) => void;
  onEdit: (m: Missionary) => void;
  onDelete: (m: Missionary) => void;
}

export function MissionariesTable({ missionaries, onView, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Missionary</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {missionaries.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <img src={m.imageUrl || `https://ui-avatars.com/api/?name=${m.user.name}&background=random`} alt={m.title || 'User'} className="w-10 h-10 rounded-full object-cover"/>
                <div>
                  <p className="font-medium">{m.title}</p>
                  {/* <p className="text-sm text-gray-500">{m.title}</p> */}
                </div>
              </div>
            </TableCell>
            <TableCell>{m.location}</TableCell>
            <TableCell>
              {m.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400"/> {m.email}</div>}
              {m.phone && <div className="flex items-center gap-2 text-sm text-gray-600 mt-1"><Phone className="w-4 h-4 text-gray-400"/> {m.phone}</div>}
            </TableCell>
            <TableCell><Badge variant="outline">{m.type}</Badge></TableCell>
            <TableCell>
              <Badge className={m.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{m.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onView(m)}><Eye className="h-4 w-4 text-blue-600" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(m)}><Edit className="h-4 w-4 text-green-600" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(m)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}