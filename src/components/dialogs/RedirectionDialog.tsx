
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RedirectionDialog = () => {
  const handleRedirect = () => {
    window.location.href = "https://quran-hadith-app.vercel.app/";
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pemberitahuan Pengalihan</AlertDialogTitle>
          <AlertDialogDescription>
            Website ini telah pindah ke alamat baru. Anda akan dialihkan ke halaman baru.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleRedirect}>
            Lanjutkan ke Website Baru
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RedirectionDialog;
