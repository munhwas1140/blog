'use client';

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
  ModalButtonContainer,
  CancelButton,
  ConfirmButton,
} from './DeleteConfirmModal.styles';

interface DeleteConfirmModalProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>글 삭제 확인</ModalTitle>
        <ModalText>
          정말 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </ModalText>

        <ModalButtonContainer>
          <CancelButton onClick={onCancel} disabled={isDeleting}>
            취소
          </CancelButton>
          <ConfirmButton onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </ConfirmButton>
        </ModalButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DeleteConfirmModal;
