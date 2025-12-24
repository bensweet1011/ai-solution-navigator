import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FullReportProps {
  markdown: string;
}

const SECTIONS = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'problem-framing', label: 'Problem Framing' },
  { id: 'solution-concept', label: 'Solution Concept' },
  { id: 'ai-feasibility-assessment', label: 'AI Feasibility' },
  { id: 'market-snapshot', label: 'Market Snapshot' },
  { id: 'viability-analysis', label: 'Viability Analysis' },
  { id: 'risks--responsible-ai', label: 'Risks & Responsible AI' },
  { id: 'next-steps', label: 'Next Steps' },
];

export function FullReport({ markdown }: FullReportProps) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const reportContent = document.getElementById('report-content');
      if (!reportContent) return;

      const headings = reportContent.querySelectorAll('h2');
      let currentSection = SECTIONS[0].id;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
          const matchingSection = SECTIONS.find(s => s.id === id);
          if (matchingSection) {
            currentSection = matchingSection.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;

    const headings = reportContent.querySelectorAll('h2');
    headings.forEach((heading) => {
      const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
      if (id === sectionId) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-solution-assessment.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card-enterprise animate-fade-in">
      {/* Export Bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Full Assessment Report
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Download Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>

        {/* Section Navigator */}
        <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto scrollbar-thin">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "nav-tab whitespace-nowrap",
                activeSection === section.id && "nav-tab-active"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
        <div className="markdown-content">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
