import dbConnect from '../../lib/dbConnect';
import Faq from '../../models/Faq';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, answer, isActive, order } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const faq = await Faq.create({
      question,
      answer,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}