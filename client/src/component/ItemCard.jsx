import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

function ItemCard({ item }) {
  // Ensure the image URL has forward slashes instead of backslashes from Windows paths (if any)
  const imageUrl = item.images && item.images.length > 0 
    ? `http://localhost:5000/${item.images[0].replace(/\\/g, '/')}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  // Map status to semantic colors
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    claimed: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const statusColor = statusColors[item.status] || statusColors.pending;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${statusColor} shadow-sm uppercase tracking-wider isolate`}>
            {item.status}
          </span>
        </div>
        
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-black/70 text-white backdrop-blur-md shadow-sm uppercase tracking-wider border border-white/10">
            {item.type}
          </span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <Tag size={12} className="text-slate-500" />
            {item.category}
          </span>
        </div>
        
        <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed flex-1 font-medium">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold max-w-[70%]">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">
              {item.type === 'lost' ? item.locationLost : item.locationFound}
            </span>
          </div>

          <Link to={`/item/${item._id}`} className="text-primary text-xs font-bold hover:text-primary-dark transition-colors uppercase tracking-wider">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;