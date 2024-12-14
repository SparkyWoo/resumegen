import { Document, Page, Text, View, StyleSheet, PDFViewer as ReactPDFViewer, Font } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';

// Register fonts
Font.register({
  family: 'Liberation Serif',
  fonts: [
    { 
      src: '/fonts/LiberationSerif-Regular.ttf',
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    { 
      src: '/fonts/LiberationSerif-Bold.ttf',
      fontWeight: 'bold',
      fontStyle: 'normal'
    },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: '40 60',
    fontFamily: 'Liberation Serif',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    textTransform: 'uppercase',
    paddingBottom: 4,
    borderBottom: '1 solid #000000'
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  return (
    <div className="h-full w-full">
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
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.contact}>{data.basics.email}</Text>
                {data.basics.phone && <Text style={styles.contact}>{data.basics.phone}</Text>}
                {data.basics.location && <Text style={styles.contact}>{data.basics.location}</Text>}
                {data.basics.url && <Text style={styles.contact}>{data.basics.url}</Text>}
                {data.basics.profiles?.map((profile, index) => 
                  profile.network === 'LinkedIn' ? (
                    <Text key={index} style={styles.contact}>
                      linkedin.com/in/{profile.username}
                    </Text>
                  ) : null
                )}
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
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.work.map((job, i) => (
                  <View key={i} style={{ marginBottom: i < data.work.length - 1 ? 15 : 0 }}>
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

            {/* Skills */}
            {data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Skills</Text>
                <View style={styles.skillsContainer}>
                  {/* Group skills by category */}
                  {[
                    { title: 'Backend', filter: (s: string) => s.includes('Backend:') },
                    { title: 'Frontend', filter: (s: string) => s.includes('Front End:') },
                    { title: 'Data', filter: (s: string) => s.includes('Data:') },
                    { title: 'DevOps', filter: (s: string) => s.includes('Deployment:') || s.includes('CI/CD:') }
                  ].map((category, i) => {
                    const categorySkills = data.skills.filter(category.filter);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <View key={i} style={styles.skillCategory}>
                        <Text style={styles.skillCategoryTitle}>{category.title}:</Text>
                        <Text style={styles.skillList}>
                          {categorySkills.map(skill => skill.replace(/^[^:]+:\s*/, '')).join(', ')}
                        </Text>
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
    </div>
  );
}; 