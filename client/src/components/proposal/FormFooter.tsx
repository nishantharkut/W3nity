// components/proposal/FormFooter.tsx
import { Button } from "@/components/ui/button";
import { Send, Save, Loader2 } from "lucide-react";

const FormFooter = ({
  isSubmitting,
  isDraft,
  coverLetter,
  isFormValid,
  onSubmit,
  onSaveDraft,
  onCancel,
}: {
  isSubmitting: boolean;
  isDraft: boolean;
  coverLetter: string;
  isFormValid: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 pt-4">
    <Button
      type="submit"
      className="flex-1 glow-button"
      disabled={isSubmitting || !isFormValid}
      onClick={onSubmit}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin mr-2 w-4 h-4" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 mr-2" />
          Submit Proposal
        </>
      )}
    </Button>
    <Button
      type="button"
      variant="outline"
      onClick={onSaveDraft}
      disabled={!coverLetter}
    >
      {isDraft ? (
        <>
          <Loader2 className="animate-spin mr-2 w-4 h-4" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </>
      )}
    </Button>
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
  </div>
);

export default FormFooter;
