import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getProduct, apiConfig } from '../utils/api';

const DebugProduct = ({ productId = 1 }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`🔍 Fetching product ${productId}...`);
        
        const response = await getProduct(productId);
        console.log('✅ Full Response:', response);
        console.log('✅ Response Data:', response.data);
        console.log('✅ Response Headers:', response.headers);
        
        setRawResponse(JSON.stringify(response, null, 2));
        
        // Check if response.data is a string (HTML) or object (JSON)
        if (typeof response.data === 'string') {
          throw new Error('Received HTML instead of JSON - API proxy not working');
        }
        
        setData(response.data);
      } catch (err) {
        console.error('❌ API Error:', err);
        console.error('❌ Error Details:', err.response);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '20px', backgroundColor: '#fff' }}>
      <h2 style={{ color: 'red' }}>🔍 Debug Product {productId}</h2>
      
      {/* API Configuration */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
        <strong>🔧 API Config:</strong> {apiConfig.baseURL} | Timeout: {apiConfig.timeout}ms | Debug: {apiConfig.debug ? 'ON' : 'OFF'}
      </div>
      
      <p><strong>Name:</strong> {data?.name || 'MISSING'}</p>
      <p><strong>Price:</strong> ₪{data?.price || 'MISSING'}</p>
      <p><strong>Image URL:</strong> {data?.image_url || 'MISSING'}</p>
      <p><strong>Available Carats:</strong> {data?.available_carats?.length || 0}</p>
      <p><strong>Images:</strong> {data?.images?.length || 0}</p>
      
      {/* Test direct backend call */}
      <button 
        onClick={() => {
          fetch(`${apiConfig.baseURL}/api/products/1`)
            .then(r => r.json())
            .then(d => {
              console.log('✅ Direct backend call successful:', d);
              alert(`Direct call works! Got ${d.name} with ${d.available_carats?.length} carats`);
            })
            .catch(e => {
              console.error('❌ Direct call failed:', e);
              alert('Direct call failed: ' + e.message);
            });
        }}
        style={{ padding: '10px', backgroundColor: 'green', color: 'white', margin: '10px' }}
      >
        Test Direct Backend Call
      </button>
      
      {data?.available_carats?.length > 0 && (
        <div>
          <h3>Carats:</h3>
          <ul>
            {data.available_carats.slice(0, 5).map((carat, index) => (
              <li key={index}>{carat.carat_weight} carat (ID: {carat.id})</li>
            ))}
          </ul>
        </div>
      )}
      
      <details>
        <summary>Raw Response Data (click to expand)</summary>
        <pre style={{ fontSize: '10px', maxHeight: '200px', overflow: 'auto' }}>
          {rawResponse || JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default DebugProduct; 