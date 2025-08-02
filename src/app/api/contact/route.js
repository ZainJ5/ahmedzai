import { NextResponse } from 'next/server';
import Contact from '../../models/contact';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await contact.save();
    return NextResponse.json(
      { message: 'Message saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}