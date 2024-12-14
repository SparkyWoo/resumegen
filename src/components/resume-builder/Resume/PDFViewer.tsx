import { Document, Page, Text, View, StyleSheet, PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#334155'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 3
  },
  summary: {
    fontSize: 12,
    marginBottom: 15,
    lineHeight: 1.4
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skill: {
    fontSize: 11,
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    borderRadius: 4
  }
});

interface Props {
  data: ResumeState;
}

export const PDFViewer = ({ data }: Props) => {
  return (
    <ReactPDFViewer width="100%" height={800}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.heading}>{data.basics.name}</Text>
            <Text style={styles.text}>{data.basics.email} • {data.basics.phone}</Text>
            <Text style={styles.text}>{data.basics.location}</Text>
            {data.basics.summary && (
              <Text style={styles.summary}>{data.basics.summary}</Text>
            )}
          </View>

          {/* Work Experience */}
          {data.work.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {data.work.map((work, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text style={styles.subheading}>{work.position} at {work.company}</Text>
                  <Text style={styles.text}>{work.startDate} - {work.endDate}</Text>
                  {work.highlights.map((highlight, j) => (
                    <Text key={j} style={styles.text}>• {highlight}</Text>
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
                  <Text style={styles.subheading}>{edu.studyType} in {edu.area}</Text>
                  <Text style={styles.text}>{edu.institution}</Text>
                  <Text style={styles.text}>{edu.startDate} - {edu.endDate}</Text>
                  {edu.score && <Text style={styles.text}>GPA: {edu.score}</Text>}
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
                  <Text style={styles.subheading}>{project.name}</Text>
                  <Text style={styles.text}>{project.description}</Text>
                  {project.url && <Text style={styles.text}>URL: {project.url}</Text>}
                  {project.highlights.map((highlight, j) => (
                    <Text key={j} style={styles.text}>• {highlight}</Text>
                  ))}
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
  );
}; 