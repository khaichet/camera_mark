import { NextRequest, NextResponse } from 'next/server';
import { getAllRows } from '@/app/lib/mongoDBCRUD';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Thiếu userId' },
        { status: 400 }
      );
    }

    const result = await getAllRows('photos', {
      field: 'userId',
      value: userId,
      sort: { field: 'timestamp', order: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
    });
  } catch (error: unknown) {
    console.error('Lỗi lấy danh sách ảnh:', error);
    const errorMessage = error instanceof Error ? error.message : 'Lỗi server nội bộ';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
