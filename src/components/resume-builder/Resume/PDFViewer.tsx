import { Document, Page, Text, View, StyleSheet, PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/redux/resumeSlice';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 10
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 3
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
            <Text style={styles.text}>{data.basics.email}</Text>
            <Text style={styles.text}>{data.basics.phone}</Text>
            <Text style={styles.text}>{data.basics.location}</Text>
          </View>

          {/* Work Experience */}
          {data.work.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading}>Work Experience</Text>
              {data.work.map((work, i) => (
                <View key={i} style={styles.section}>
                  <Text style={styles.text}>{work.company}</Text>
                  <Text style={styles.text}>{work.position}</Text>
                  <Text style={styles.text}>{work.startDate} - {work.endDate}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Add Education, Projects, Skills sections similarly */}
        </Page>
      </Document>
    </ReactPDFViewer>
  );
}; 