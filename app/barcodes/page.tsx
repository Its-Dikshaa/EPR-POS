import { AppLayout } from "@/components/layout/app-layout";
import { BarcodeGeneratorView } from "@/components/barcodes/barcode-generator";

export default function BarcodesPage() {
  return (
    <AppLayout>
      <BarcodeGeneratorView />
    </AppLayout>
  );
}
