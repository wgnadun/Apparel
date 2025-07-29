import { useState } from 'react';

function ImageDebug({ product }) {
  const [showDebug, setShowDebug] = useState(false);

  if (!product) {
    return <div className="text-red-500">No product data provided</div>;
  }

  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="text-sm text-blue-600 hover:text-blue-800 mb-2"
      >
        {showDebug ? 'Hide' : 'Show'} Debug Info
      </button>
      
      {showDebug && (
        <div className="text-xs space-y-2">
          <div><strong>Product ID:</strong> {product._id}</div>
          <div><strong>Title:</strong> {product.title}</div>
          <div><strong>Image URL:</strong> {product.image || 'No image URL'}</div>
          <div><strong>Image URL Type:</strong> {typeof product.image}</div>
          <div><strong>Image URL Length:</strong> {product.image?.length || 0}</div>
          {product.image && (
            <div>
              <strong>Image URL Preview:</strong> 
              <div className="break-all text-xs bg-white p-2 rounded mt-1">
                {product.image}
              </div>
            </div>
          )}
          <div><strong>Full Product Data:</strong></div>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ImageDebug; 