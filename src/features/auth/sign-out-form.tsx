import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";

type SignOutFormProps = {
  label: string;
};

export function SignOutForm({ label }: SignOutFormProps) {
  return (
    <form action={signOutAction}>
      <Button type="submit" size="sm" variant="outline">
        {label}
      </Button>
    </form>
  );
}
