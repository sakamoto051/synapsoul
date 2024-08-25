'use client';
import React, { useState, useEffect } from 'react';
import { BookItem, BookItemWrapper } from '~/types/book';

const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      let apiUrl = `${BASE_API_ENDPOINT}&page=${page}`;
      if (searchTerm) {
        apiUrl += `&title=${encodeURIComponent(searchTerm)}`;
      }
      if (authorInput) {
        apiUrl += `&author=${encodeURIComponent(authorInput)}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setBooks(data.Items.map((item: BookItemWrapper) => item.Item));
      setTotalPages(data.pageCount);
      setTotalCount(data.count);
      setCurrentPage(data.page);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm || authorInput) {
      const debounceTimer = setTimeout(() => {
        fetchBooks(1);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, authorInput]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchBooks(newPage);
    }
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#111827', color: 'white', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="タイトルで検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#1F2937', color: 'white', width: '100%' }}
        />
        <input
          type="text"
          placeholder="著者名で検索"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#1F2937', color: 'white', width: '100%' }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading books...</div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-4">
            {books.map((book: BookItem) => (
              <a
                key={book.isbn}
                href={`/books/${book.isbn}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#1F2937',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <img src={book.largeImageUrl} alt={book.title} style={{ width: '100%', height: 'auto', marginBottom: '0.5rem', borderRadius: '0.375rem' }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</h3>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</p>
              </a>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#374151', color: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#374151', color: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            {`Total results: ${totalCount}`}
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;