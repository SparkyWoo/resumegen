'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Dynamically import PDFViewer with SSR disabled
const ReactPDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { ssr: false }
);

// Tailwind spacing in points (pt) for PDF
const spacing = {
  0.5: "1.5pt",
  1: "3pt",
  2: "6pt",
  3: "9pt",
  4: "12pt",
  5: "15pt",
  6: "18pt",
  8: "24pt",
  10: "30pt",
  12: "36pt"
};

const styles = StyleSheet.create({
  page: {
    padding: `${spacing[6]} ${spacing[8]}`,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#171717'
  },
  header: {
    marginBottom: spacing[4],
    paddingBottom: spacing[1],
    borderBottom: '0.5 solid #404040'
  },
  name: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    marginBottom: spacing[1],
    textAlign: 'center',
    color: '#171717'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[1],
    fontSize: 9,
    color: '#404040'
  },
  contactDivider: {
    color: '#404040'
  },
  section: {
    marginBottom: spacing[3]
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    marginBottom: spacing[1],
    color: '#171717',
    textTransform: 'uppercase',
    paddingBottom: spacing[0.5],
    borderBottom: '0.5 solid #404040'
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#171717'
  },
  company: {
    marginBottom: spacing[2]
  },
  companyHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[0.5]
  },
  companyInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },
  companyName: {
    fontSize: 10,
    color: '#404040'
  },
  date: {
    fontSize: 9,
    color: '#525252',
    fontStyle: 'italic'
  },
  bullet: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: spacing[0.5],
    paddingLeft: spacing[3]
  },
  bulletPoint: {
    width: spacing[1],
    fontSize: 8,
    marginRight: spacing[1]
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.3,
    color: '#404040'
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5]
  },
  skillRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: spacing[0.5]
  },
  skillCategoryTitle: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    color: '#171717',
    width: '100pt'
  },
  skillList: {
    flex: 1,
    fontSize: 10,
    color: '#404040',
    lineHeight: 1.3
  },
  summary: {
    marginBottom: spacing[2],
    color: '#404040',
    lineHeight: 1.3,
    fontSize: 10
  }
});

export const PDFViewer = ({ data }: { data: ResumeState }) => {
  // Helper function to check if a section is empty
  const isSectionEmpty = (section: string) => {
    switch (section) {
      case 'contact':
        return !data.basics.email && !data.basics.phone && !data.basics.location;
      case 'summary':
        return !data.basics.summary?.trim();
      case 'work':
        return data.work.length === 0 || !data.work.some(job => job.company?.trim());
      case 'projects':
        return data.projects.length === 0 || !data.projects.some(proj => proj.name?.trim());
      case 'skills':
        return data.skills.length === 0;
      default:
        return true;
    }
  };

  // Helper function to split highlights by newlines
  const splitHighlights = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const handleDownload = async (): Promise<void> => {
    try {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.name}>{data.basics.name}</Text>
              <View style={styles.contactInfo}>
                {[
                  data.basics.location,
                  data.basics.phone,
                  data.basics.email,
                  data.basics.url,
                  data.basics.profiles?.find(p => p.network === 'LinkedIn')?.username && 
                    `linkedin.com/in/${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}`
                ].filter(Boolean).map((item, index, arr) => (
                  <React.Fragment key={index}>
                    <Text>{item}</Text>
                    {index < arr.length - 1 && <Text style={styles.contactDivider}> | </Text>}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Summary */}
            {!isSectionEmpty('summary') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summary}>{data.basics.summary}</Text>
              </View>
            )}

            {/* Work Experience */}
            {!isSectionEmpty('work') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.work.map((job, i) => (
                  <View key={i} style={[
                    styles.company,
                    i < data.work.length - 1 ? { marginBottom: spacing[4] } : {}
                  ]}>
                    <View style={styles.companyHeader}>
                      <View style={styles.companyInfo}>
                        <Text style={styles.jobTitle}>{job.position}</Text>
                        <Text style={styles.companyName}>{job.company}</Text>
                      </View>
                      <Text style={styles.date}>{job.startDate} - {job.endDate}</Text>
                    </View>
                    {job.highlights.flatMap(highlight => 
                      splitHighlights(highlight).map((line, j) => (
                        <View key={`${i}-${j}`} style={styles.bullet}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletText}>{line}</Text>
                        </View>
                      ))
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {!isSectionEmpty('projects') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((project, i) => (
                  <View key={i} style={[
                    styles.company,
                    i < data.projects.length - 1 ? { marginBottom: spacing[2] } : {}
                  ]}>
                    <View style={styles.companyHeader}>
                      <View style={styles.companyInfo}>
                        <Text style={styles.jobTitle}>{project.name}</Text>
                        {project.url && (
                          <Text style={styles.companyName}>{project.url}</Text>
                        )}
                      </View>
                    </View>
                    {project.highlights.flatMap(highlight => 
                      splitHighlights(highlight).map((line, j) => (
                        <View key={`${i}-${j}`} style={styles.bullet}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletText}>{line}</Text>
                        </View>
                      ))
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {!isSectionEmpty('skills') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skillList}>
                  {data.skills.join(', ')}
                </Text>
              </View>
            )}
          </Page>
        </Document>
      ).toBlob();
      
      saveAs(blob, 'resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Make handleDownload available globally
  if (typeof window !== 'undefined') {
    (window as any).downloadResumePDF = handleDownload;
  }

  return (
    <div className="h-full w-full">
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }>
        <ReactPDFViewer 
          style={{ width: '100%', height: '100vh' }}
          showToolbar={false}
        >
          <Document>
            <Page size="A4" style={styles.page}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.name}>{data.basics.name}</Text>
                <View style={styles.contactInfo}>
                  {[
                    data.basics.location,
                    data.basics.phone,
                    data.basics.email,
                    data.basics.url,
                    data.basics.profiles?.find(p => p.network === 'LinkedIn')?.username && 
                      `linkedin.com/in/${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}`
                  ].filter(Boolean).map((item, index, arr) => (
                    <React.Fragment key={index}>
                      <Text>{item}</Text>
                      {index < arr.length - 1 && <Text style={styles.contactDivider}> | </Text>}
                    </React.Fragment>
                  ))}
                </View>
              </View>

              {/* Summary */}
              {!isSectionEmpty('summary') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <Text style={styles.summary}>{data.basics.summary}</Text>
                </View>
              )}

              {/* Work Experience */}
              {!isSectionEmpty('work') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {data.work.map((job, i) => (
                    <View key={i} style={[
                      styles.company,
                      i < data.work.length - 1 ? { marginBottom: spacing[4] } : {}
                    ]}>
                      <View style={styles.companyHeader}>
                        <View style={styles.companyInfo}>
                          <Text style={styles.jobTitle}>{job.position}</Text>
                          <Text style={styles.companyName}>{job.company}</Text>
                        </View>
                        <Text style={styles.date}>{job.startDate} - {job.endDate}</Text>
                      </View>
                      {job.highlights.flatMap(highlight => 
                        splitHighlights(highlight).map((line, j) => (
                          <View key={`${i}-${j}`} style={styles.bullet}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{line}</Text>
                          </View>
                        ))
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {!isSectionEmpty('projects') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {data.projects.map((project, i) => (
                    <View key={i} style={[
                      styles.company,
                      i < data.projects.length - 1 ? { marginBottom: spacing[2] } : {}
                    ]}>
                      <View style={styles.companyHeader}>
                        <View style={styles.companyInfo}>
                          <Text style={styles.jobTitle}>{project.name}</Text>
                          {project.url && (
                            <Text style={styles.companyName}>{project.url}</Text>
                          )}
                        </View>
                      </View>
                      {project.highlights.flatMap(highlight => 
                        splitHighlights(highlight).map((line, j) => (
                          <View key={`${i}-${j}`} style={styles.bullet}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{line}</Text>
                          </View>
                        ))
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Skills */}
              {!isSectionEmpty('skills') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <Text style={styles.skillList}>
                    {data.skills.join(', ')}
                  </Text>
                </View>
              )}

            </Page>
          </Document>
        </ReactPDFViewer>
      </React.Suspense>
    </div>
  );
}; 