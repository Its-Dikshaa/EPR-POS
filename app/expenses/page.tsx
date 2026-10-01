import { AppLayout } from "@/components/layout/app-layout";
import { ExpensesView } from "@/components/expenses/expenses-view";

export default function ExpensesPage() {
  return (
    <AppLayout>
      <ExpensesView />
    </AppLayout>
  );
}
