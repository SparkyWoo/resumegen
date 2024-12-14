import { Document, Page, Text, View, StyleSheet, PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';

const styles = StyleSheet.create({
  page: {
    padding: '40 50',
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#334155'
  },
  header: {
    marginBottom: 20
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827'
  },
  contact: {
    flexDirection: 'row',
    gap: 15,
    color: '#4B5563',
    fontSize: 11
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    textTransform: 'uppercase',
    paddingBottom: 4,
    borderBottom: '1 solid #E5E7EB'
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827'
  },
  company: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563'
  },
  date: {
    fontSize: 11,
    color: '#6B7280'
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 8
  },
  bulletPoint: {
    width: 6,
    fontSize: 9,
    marginRight: 6,
    marginTop: 4
  },
  bulletText: {
    flex: 1
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 10,
    color: '#4B5563'
  },
  summary: {
    marginBottom: 15,
    color: '#4B5563',
    lineHeight: 1.6
  }
});

export const PDFViewer = ({ data }: { data: ResumeState }) => {
  return (
    <div className="h-full w-full">
      <ReactPDFViewer width="100%" height="100%" showToolbar={false}>
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.name}>{data.basics.name}</Text>
              <View style={styles.contact}>
                {data.basics.email && <Text>{data.basics.email}</Text>}
                {data.basics.phone && <Text>{data.basics.phone}</Text>}
                {data.basics.location && <Text>{data.basics.location}</Text>}
                {data.basics.url && <Text>{data.basics.url}</Text>}
              </View>
            </View>

            {/* Summary */}
            {data.basics.summary && (
              <View style={styles.section}>
                <Text style={styles.summary}>{data.basics.summary}</Text>
              </View>
            )}

            {/* Work Experience */}
            {data.work.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.work.map((job, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={styles.company}>
                      <Text style={styles.jobTitle}>{job.position}</Text>
                      <Text style={styles.date}>{job.startDate} - {job.endDate}</Text>
                    </View>
                    <Text style={styles.companyName}>{job.company}</Text>
                    {job.highlights.map((highlight, j) => (
                      <View key={j} style={styles.bullet}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((project, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={styles.company}>
                      <Text style={styles.jobTitle}>{project.name}</Text>
                      {project.url && <Text style={styles.date}>{project.url}</Text>}
                    </View>
                    {project.description && (
                      <Text style={styles.companyName}>{project.description}</Text>
                    )}
                    {project.highlights.map((highlight, j) => (
                      <View key={j} style={styles.bullet}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={styles.company}>
                      <Text style={styles.jobTitle}>{edu.studyType} {edu.area}</Text>
                      <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                    </View>
                    <Text style={styles.companyName}>{edu.institution}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skills}>
                  {data.skills.map((skill, i) => (
                    <Text key={i} style={styles.skill}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}
          </Page>
        </Document>
      </ReactPDFViewer>
    </div>
  );
}; 