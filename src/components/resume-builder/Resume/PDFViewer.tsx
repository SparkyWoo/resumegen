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

const styles = StyleSheet.create({
  page: {
    padding: '40 60',
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '1 solid #000000'
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    width: '30%',
    textAlign: 'right'
  },
  name: {
    fontSize: 28,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
    color: '#000000'
  },
  contact: {
    color: '#1a1a1a',
    fontSize: 10,
    lineHeight: 1.4
  },
  contactLink: {
    color: '#000000',
    textDecoration: 'none'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    marginBottom: 12,
    color: '#000000',
    textTransform: 'uppercase',
    paddingBottom: 4,
    borderBottom: '1 solid #000000'
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#000000'
  },
  company: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 12
  },
  companyName: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#1a1a1a'
  },
  date: {
    fontSize: 11,
    color: '#1a1a1a'
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 12
  },
  bulletPoint: {
    width: 6,
    fontSize: 10,
    marginRight: 6,
    marginTop: 2
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4
  },
  skillsContainer: {
    marginTop: 8
  },
  skillCategory: {
    marginBottom: 8
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
    color: '#000000'
  },
  skillList: {
    fontSize: 11,
    color: '#1a1a1a',
    lineHeight: 1.4
  },
  summary: {
    marginBottom: 20,
    color: '#1a1a1a',
    lineHeight: 1.6,
    fontSize: 11
  }
});

export const PDFViewer = ({ data }: { data: ResumeState }) => {
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
                  <Text style={styles.contact}>
                    {[
                      data.basics.location,
                      data.basics.phone,
                      data.basics.email,
                      data.basics.url,
                      data.basics.profiles?.find(p => p.network === 'LinkedIn')?.username && 
                        `linkedin.com/in/${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}`
                    ].filter(Boolean).join(' • ')}
                  </Text>
                </View>
              </View>

              {/* Summary */}
              {data.basics.summary && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <Text style={styles.summary}>{data.basics.summary}</Text>
                </View>
              )}

              {/* Work Experience */}
              {data.work.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {data.work.map((job, i) => (
                    <View key={i} style={{ marginBottom: i < data.work.length - 1 ? 15 : 0 }}>
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
              {data.projects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {data.projects.map((project, i) => (
                    <View key={i} style={{ marginBottom: i < data.projects.length - 1 ? 15 : 0 }}>
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
              {data.skills.length > 0 && (
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
              {data.education.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {data.education.map((edu, i) => (
                    <View key={i} style={{ marginBottom: i < data.education.length - 1 ? 10 : 0 }}>
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