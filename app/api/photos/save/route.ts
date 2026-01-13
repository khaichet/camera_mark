
import { NextRequest, NextResponse } from 'next/server';
import PocketBase, { ClientResponseError } from 'pocketbase';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('uploadId');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const uploadId = req.nextUrl.searchParams.get('uploadId') || 'unknown';
  console.log('--- BẮT ĐẦU API UPLOAD (SERVER SIDE) ---', uploadId);

  try {

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'File không hợp lệ' }, { status: 400 });
    }

    const sender = formData.get('sender') as string;
    const receiver = (formData.get('receiver') as string) || '';
    const batchId = (formData.get('batchId') as string) || undefined;
    const skipSaveMessage = formData.get('skipSaveMessage') === 'true';

    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://files.hupuna.vn/';
    const identity = process.env.NEXT_PUBLIC_POCKETBASE_USER_ID;
    const password = process.env.NEXT_PUBLIC_POCKETBASE_PASSWORD;
    const collectionName = process.env.NEXT_PUBLIC_POCKETBASE_COLLECTION_FILES || 'camera';

    if (!identity || !password) {
      return NextResponse.json({ success: false, message: 'Lỗi cấu hình server: Thiếu .env' }, { status: 500 });
    }

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
      try {
        await pb.admins.authWithPassword(identity, password);
      } catch {
        await pb.collection('users').authWithPassword(identity, password);
      }
    } catch (e: unknown) {
      console.error('Lỗi đăng nhập System PB:', e);
      return NextResponse.json(
        { success: false, message: 'Không thể đăng nhập vào hệ thống lưu trữ' },
        { status: 401 },
      );
    }
    const pbFormData = new FormData();
    pbFormData.append('file', file);
    const title = (formData.get('title') as string) || file.name;
    pbFormData.append('title', title);

    if (formData.has('folder')) {
      pbFormData.append('folder', formData.get('folder') as string);
    }

    if (pb.authStore.model?.id) {
      pbFormData.append('users_id', pb.authStore.model.id);
    }


    const record = await pb.collection(collectionName).create(pbFormData);


    const baseUrl = pbUrl.endsWith('/') ? pbUrl.slice(0, -1) : pbUrl;
    const fullUrl = `${baseUrl}/api/files/${record.collectionId}/${record.id}/${record.file}`;


    let insertedId: string | undefined = undefined;



    return NextResponse.json({
      success: true,
      link: fullUrl,
      _id: insertedId,
      saved: !!insertedId,
      result: {
        id: record.id,
        url: fullUrl,
        filename: record.file,
      },
    });
  } catch (error: unknown) {
    console.error('Lỗi API Upload:', error);

    let errorMessage = 'Lỗi server nội bộ';
    let statusCode = 500;

    if (error instanceof ClientResponseError) {
      statusCode = error.status;
      errorMessage = error.message;
      console.error('PB Response:', error.response);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode });
  }
}