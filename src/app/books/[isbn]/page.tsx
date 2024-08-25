'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { BookItem } from '~/types/book';

const APPLICATION_ID = process.env.NEXT_PUBLIC_RAKUTEN_APPLICATION_ID;
const API_ENDPOINT = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${APPLICATION_ID}`;

const BookDetail = () => {
  const [book, setBook] = useState<BookItem>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isbn = params['isbn'] as string;

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!isbn) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
        const data = await response.json();
        if (data.Items && data.Items.length > 0) {
          setBook(data.Items[0].Item);
        } else {
          console.error('Book not found');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [isbn]);

  const handleBack = () => {
    const title = searchParams.get('title') || '';
    const author = searchParams.get('author') || '';
    const page = searchParams.get('page') || '1';

    const searchConditions = new URLSearchParams();
    if (title) searchConditions.append('title', title);
    if (author) searchConditions.append('author', author);
    if (page !== '1') searchConditions.append('page', page);

    const searchString = searchConditions.toString();
    router.push(`/?${searchString}`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading book details...</div>;
  }

  if (!book) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Book not found</div>;
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#111827',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{book.title}</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        maxWidth: '800px',
        width: '100%',
        backgroundColor: '#1F2937',
        borderRadius: '0.5rem',
        padding: '2rem'
      }}>
        <img
          src={book.largeImageUrl}
          alt={book.title}
          style={{
            width: '200px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '0.25rem'
          }}
        />
        <div style={{ flex: 1 }}>
          <p><strong>著者:</strong> {book.author}</p>
          <p><strong>出版社:</strong> {book.publisherName}</p>
          <p><strong>発売日:</strong> {book.salesDate}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>価格:</strong> {book.itemPrice}円</p>
          <p style={{ marginTop: '1rem' }}>{book.itemCaption}</p>
        </div>
      </div>
      <button
        onClick={handleBack}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        戻る
      </button>
    </div>
  );
};

export default BookDetail;