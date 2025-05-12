import about_info from "@/constant/About";
import Link from "next/link";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Github } from 'react-bootstrap-icons';

export const metadata = {
    title: 'About DSOJ',
    description: 'DSOJ is an Online Judge platform developed by DSCS-Club, designed to meet the needs of coding enthusiasts. It supports technical growth, learning, culture, and beliefs, providing a space where coders can improve both their skills and sense of identity.',
};

export default function About() {
    const { github_data } = about_info;
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1>About Us</h1>
                    <p>

                    </p>
                </Col>
            </Row>
            <Row className="mt-4">
                {/* {generateAboutCard()} */}
            </Row>
            <Row className="mt-4">
                <Col>
                    <Button
                        href={github_data.repo_link}
                        target="_blank"
                        variant="dark"
                    >
                        <Github />
                        &nbsp;
                        {github_data.repo_name}
                    </Button>
                </Col>
                <Col>
                    <Link className="link-secondary" href={github_data.project_link}>
                        Wanna Contribute? View more on GitHub Project!
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}