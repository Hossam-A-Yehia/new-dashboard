import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReplyInvitationModal from "./ReplyInvitationModal";

vi.mock(
  "@/components/molecules/Modals/ReplyInvitationModalContent/ReplyInvitationModalContent",
  () => {
    return {
      default: ({ onCancel }: { onCancel: () => void }) => (
        <div data-testid="reply-modal-content">
          <button data-testid="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ),
    };
  }
);

describe("ReplyInvitationModal", () => {
  it("should not render when isOpen is false", () => {
    render(
      <ReplyInvitationModal
        isOpen={false}
        onCancel={() => {}}
        invitableId={1}
      />
    );
    expect(screen.queryByTestId("reply-modal-overlay")).toBeNull();
  });

  it("should render when isOpen is true", () => {
    render(
      <ReplyInvitationModal isOpen={true} onCancel={() => {}} invitableId={1} />
    );
    expect(screen.getByTestId("reply-modal-overlay")).toBeDefined();
  });

  it("should display ReplyInvitationModalContent when open", () => {
    render(
      <ReplyInvitationModal isOpen={true} onCancel={() => {}} invitableId={1} />
    );
    expect(screen.getByTestId("reply-modal-content")).toBeDefined();
  });

  it("should call onCancel when cancel button is clicked", () => {
    const onCancelMock = vi.fn();
    render(
      <ReplyInvitationModal
        isOpen={true}
        onCancel={onCancelMock}
        invitableId={1}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
