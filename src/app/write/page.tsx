import { WriteForm } from '@/components';

export default function WritePage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">새로운 글 쓰기</h1>
      <WriteForm />
    </div>
  );
}
