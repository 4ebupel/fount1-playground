import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GenericDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GenericDialog({ title, content, isOpen, onClose }: GenericDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <p>{content}</p>
        </div>  
      </DialogContent>
    </Dialog>
  )
}