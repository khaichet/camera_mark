export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import User from '@/models/User';

// GET - Lấy danh sách users
export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find().select('-password');

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Không thể lấy danh sách users: ' + errorMessage },
      { status: 500 }
    );
  }
}

// POST - Đăng ký user mới
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { username, password, name, email } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username đã tồn tại' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      username,
      password, // In production, hash with bcrypt
      name: name || username,
      email: email || '',
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo user thành công',
        user: {
          id: newUser._id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Lỗi khi tạo user: ' + errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật user
export async function PUT(request: Request) {
  try {
    await connectToDatabase();

    const { id, name, email, password } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID user là bắt buộc' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // In production, hash with bcrypt

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật user thành công',
      user: updatedUser,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật user: ' + errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Xoá user
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID user là bắt buộc' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xoá user thành công',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Lỗi khi xoá user: ' + errorMessage },
      { status: 500 }
    );
  }
}
