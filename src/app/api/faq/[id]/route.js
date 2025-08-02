import dbConnect from '../../../lib/dbConnect';
import Faq from '../../../models/Faq';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    const faq = await Faq.findById(id);
    
    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    
    return NextResponse.json({ faq }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { question, answer, isActive, order } = body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, isActive, order },
      { new: true, runValidators: true }
    );
    
    if (!updatedFaq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    
    return NextResponse.json({ faq: updatedFaq }, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    const deletedFaq = await Faq.findByIdAndDelete(id);
    
    if (!deletedFaq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}