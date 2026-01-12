import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: 'Username hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Username hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập: ' + errorMessage },
      { status: 500 }
    );
  }
}
