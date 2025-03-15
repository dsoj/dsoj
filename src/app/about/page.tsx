import about_info from "@/constants/about_information";
import Link from "next/link";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Github } from 'react-bootstrap-icons';


export default function About() {
    const { card_data, github_data } = about_info;
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