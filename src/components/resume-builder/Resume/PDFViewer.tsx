'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';

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
    padding: `${spacing[8]} ${spacing[10]}`,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.3,
    color: '#171717'  // neutral-900
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: spacing[6],
    paddingBottom: spacing[2],
    borderBottom: '0.5 solid #404040'  // neutral-700
  },
  headerLeft: {
    flex: 1,
    marginBottom: spacing[1]
  },
  name: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    marginBottom: spacing[1],
    color: '#171717'  // neutral-900
  },
  contactContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing[4],
    flexWrap: 'wrap'
  },
  contact: {
    color: '#404040',  // neutral-700
    fontSize: 9,
    lineHeight: 1.4
  },
  section: {
    marginBottom: spacing[4]
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    marginBottom: spacing[2],
    color: '#171717',  // neutral-900
    textTransform: 'uppercase',
    paddingBottom: spacing[0.5],
    borderBottom: '0.5 solid #404040'  // neutral-700
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#171717'  // neutral-900
  },
  company: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[0.5],
    marginTop: spacing[2]
  },
  companyName: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#404040'  // neutral-700
  },
  date: {
    fontSize: 9,
    color: '#525252'  // neutral-600
  },
  bullet: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: spacing[0.5],
    paddingLeft: spacing[2]
  },
  bulletPoint: {
    width: spacing[1],
    fontSize: 8,
    marginRight: spacing[1],
    marginTop: "2pt"
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.3,
    color: '#404040'  // neutral-700
  },
  skillsContainer: {
    marginTop: spacing[1]
  },
  skillCategory: {
    marginBottom: spacing[1]
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#171717',  // neutral-900
    marginRight: spacing[1]
  },
  skillList: {
    flex: 1,
    fontSize: 10,
    color: '#404040',  // neutral-700
    lineHeight: 1.3
  },
  summary: {
    marginBottom: spacing[3],
    color: '#404040',  // neutral-700
    lineHeight: 1.4,
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
      case 'education':
        return data.education.length === 0 || !data.education.some(edu => edu.institution?.trim());
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
                <View style={styles.headerLeft}>
                  <Text style={styles.name}>{data.basics.name}</Text>
                  <View style={styles.contactContainer}>
                    {data.basics.email && (
                      <Text style={styles.contact}>{data.basics.email}</Text>
                    )}
                    {data.basics.phone && (
                      <Text style={styles.contact}>{data.basics.phone}</Text>
                    )}
                    {data.basics.location && (
                      <Text style={styles.contact}>{data.basics.location}</Text>
                    )}
                    {data.basics.url && (
                      <Text style={styles.contact}>{data.basics.url}</Text>
                    )}
                    {data.basics.profiles?.find(p => p.network === 'LinkedIn')?.username && (
                      <Text style={styles.contact}>
                        linkedin.com/in/{data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}
                      </Text>
                    )}
                  </View>
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
                    <View key={i} style={{ marginBottom: i < data.work.length - 1 ? spacing[4] : 0 }}>
                      <View style={styles.company}>
                        <Text style={styles.jobTitle}>{job.position}</Text>
                        <Text style={styles.date}>{job.startDate} - {job.endDate}</Text>
                      </View>
                      <Text style={styles.companyName}>{job.company}</Text>
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
                    <View key={i} style={{ marginBottom: i < data.projects.length - 1 ? spacing[4] : 0 }}>
                      <View style={styles.company}>
                        <Text style={styles.jobTitle}>{project.name}</Text>
                        {project.url && <Text style={styles.date}>{project.url}</Text>}
                      </View>
                      <Text style={styles.bulletText}>{project.description}</Text>
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
                  <View style={styles.skillsContainer}>
                    {[
                      { title: 'Languages', filter: (s: string) => s.includes('Languages:') },
                      { title: 'Frameworks', filter: (s: string) => s.includes('Frameworks:') },
                      { title: 'Tools', filter: (s: string) => s.includes('Tools:') },
                      { title: 'Platforms', filter: (s: string) => s.includes('Platforms:') }
                    ].map((category, i) => {
                      const categorySkills = data.skills.filter(category.filter);
                      if (categorySkills.length === 0) return null;
                      
                      const skillLines = categorySkills
                        .flatMap(skill => splitHighlights(skill.replace(/^[^:]+:\s*/, '')))
                        .join(', ');
                      
                      return (
                        <View key={i} style={styles.bullet}>
                          <Text style={styles.skillCategoryTitle}>{category.title}: </Text>
                          <Text style={styles.skillList}>{skillLines}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Education */}
              {!isSectionEmpty('education') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {data.education.map((edu, i) => (
                    <View key={i} style={{ marginBottom: i < data.education.length - 1 ? spacing[3] : 0 }}>
                      <View style={styles.company}>
                        <Text style={styles.jobTitle}>{edu.studyType} {edu.area}</Text>
                        <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                      </View>
                      <Text style={styles.companyName}>{edu.institution}</Text>
                    </View>
                  ))}
                </View>
              )}

            </Page>
          </Document>
        </ReactPDFViewer>
      </React.Suspense>
    </div>
  );
}; 