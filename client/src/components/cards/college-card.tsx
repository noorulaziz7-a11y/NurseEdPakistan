import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone, Mail, Globe } from "lucide-react";
import type { College } from "@shared/schema";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const programs = Array.isArray(college.programs) ? college.programs : [];
  const contact = college.contact as any || {};
  const accreditation = Array.isArray(college.accreditation) ? college.accreditation : [];

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow" data-testid={`card-college-${college.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`text-college-name-${college.id}`}>
            {college.name}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="mr-2 w-4 h-4" />
            <span data-testid={`text-college-location-${college.id}`}>{college.city}, {college.province}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded ${college.type === 'private' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`} data-testid={`badge-college-type-${college.id}`}>
              {college.type.charAt(0).toUpperCase() + college.type.slice(1)}
            </span>
            {accreditation.map((acc, index) => (
              <span key={index} className="bg-accent/10 text-accent px-2 py-1 rounded" data-testid={`badge-accreditation-${college.id}-${index}`}>
                {acc}
              </span>
            ))}
          </div>
        </div>
        {college.rating && (
          <div className="text-right">
            <div className="flex items-center text-yellow-500 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium" data-testid={`text-college-rating-${college.id}`}>{college.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground" data-testid={`text-college-reviews-${college.id}`}>
              {college.reviewCount} reviews
            </span>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm mb-4" data-testid={`text-college-description-${college.id}`}>
        {college.description}
      </p>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-muted-foreground">Programs:</span>
          <div className="text-card-foreground font-medium" data-testid={`text-college-programs-${college.id}`}>
            {programs.join(", ")}
          </div>
        </div>
        {college.admissionFee && (
          <div>
            <span className="text-muted-foreground">Admission Fee:</span>
            <div className="text-card-foreground font-medium" data-testid={`text-college-fee-${college.id}`}>
              PKR {college.admissionFee.toLocaleString()}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-primary hover:underline text-sm font-medium p-0" data-testid={`button-view-details-${college.id}`}>
          View Details
        </Button>
        <div className="flex space-x-2">
          {contact.phone && (
            <Button variant="ghost" size="icon" className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid={`button-phone-${college.id}`}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
          {contact.email && (
            <Button variant="ghost" size="icon" className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid={`button-email-${college.id}`}>
              <Mail className="w-4 h-4" />
            </Button>
          )}
          {contact.website && (
            <Button variant="ghost" size="icon" className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid={`button-website-${college.id}`}>
              <Globe className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
