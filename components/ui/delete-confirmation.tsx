
import { AlertTriangle, Loader2 } from "lucide-react"
import { DialogContent, Dialog, DialogHeader, DialogDescription, DialogFooter } from "./dialog"
import { Button } from "./button"
interface DeleteConfirmationProps {
    header: string;
    description: string;
    setShowDeleteDialog: (show: boolean) => void;
    showDeleteDialog: boolean;
    warningMessage?: string;
    isDeleting: boolean;
    handleDelete: () => void;
}
const DeleteConfirmation = ({
    header, description, setShowDeleteDialog,
    showDeleteDialog, warningMessage, isDeleting, handleDelete }: DeleteConfirmationProps) => {
    return (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogHeader>{header}</DialogHeader>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-red-50 p-4 rounded-md border border-red-100 my-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Warning</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>
                                    {warningMessage || "This action cannot be undone."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default DeleteConfirmation