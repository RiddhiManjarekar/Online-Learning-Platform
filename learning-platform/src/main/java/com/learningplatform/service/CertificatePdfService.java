
package com.learningplatform.service;

import com.learningplatform.entity.Certificate;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class CertificatePdfService {

    public byte[] generatePdf(Certificate certificate) {

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // A4 landscape page
            PDRectangle a4 = PDRectangle.A4;

            PDRectangle landscape = new PDRectangle(
                    a4.getHeight(),
                    a4.getWidth()
            );

            PDPage page = new PDPage(landscape);
            document.addPage(page);

            float pageWidth = page.getMediaBox().getWidth();
            float pageHeight = page.getMediaBox().getHeight();

            PDType1Font titleFont = new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA_BOLD
            );

            PDType1Font regularFont = new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA
            );

            PDType1Font nameFont = new PDType1Font(
                    Standard14Fonts.FontName.TIMES_BOLD
            );

            try (PDPageContentStream content =
                         new PDPageContentStream(document, page)) {

                // White background
                content.setNonStrokingColor(Color.WHITE);
                content.addRect(0, 0, pageWidth, pageHeight);
                content.fill();

                // Outer border
                content.setStrokingColor(new Color(30, 58, 138));
                content.setLineWidth(5);
                content.addRect(25, 25, pageWidth - 50, pageHeight - 50);
                content.stroke();

                // Inner border
                content.setStrokingColor(new Color(202, 138, 4));
                content.setLineWidth(1.5f);
                content.addRect(35, 35, pageWidth - 70, pageHeight - 70);
                content.stroke();

                // Certificate heading
                drawCenteredText(
                        content,
                        "CERTIFICATE OF COMPLETION",
                        titleFont,
                        27,
                        pageWidth,
                        pageHeight - 125,
                        new Color(30, 58, 138)
                );

                drawCenteredText(
                        content,
                        "LEARNHUB",
                        titleFont,
                        15,
                        pageWidth,
                        pageHeight - 160,
                        new Color(180, 120, 20)
                );

                drawCenteredText(
                        content,
                        "This certificate is proudly presented to",
                        regularFont,
                        14,
                        pageWidth,
                        pageHeight - 225,
                        Color.DARK_GRAY
                );

                drawCenteredText(
                        content,
                        safeText(certificate.getLearnerName()),
                        nameFont,
                        30,
                        pageWidth,
                        pageHeight - 280,
                        new Color(30, 58, 138)
                );

                drawCenteredText(
                        content,
                        "For successfully completing the course",
                        regularFont,
                        14,
                        pageWidth,
                        pageHeight - 325,
                        Color.DARK_GRAY
                );

                drawCenteredText(
                        content,
                        safeText(certificate.getCourseTitle()),
                        titleFont,
                        20,
                        pageWidth,
                        pageHeight - 365,
                        new Color(30, 58, 138)
                );

                String issueDate = certificate.getIssuedAt().format(
                        DateTimeFormatter.ofPattern("dd MMMM yyyy")
                );

                drawCenteredText(
                        content,
                        "Issued on: " + issueDate,
                        regularFont,
                        12,
                        pageWidth,
                        105,
                        Color.DARK_GRAY
                );

                drawCenteredText(
                        content,
                        "Certificate ID: " + certificate.getCertificateNumber(),
                        regularFont,
                        10,
                        pageWidth,
                        80,
                        Color.GRAY
                );

                drawCenteredText(
                        content,
                        "Verify this certificate using its unique certificate ID.",
                        regularFont,
                        9,
                        pageWidth,
                        60,
                        Color.GRAY
                );
            }

            document.save(outputStream);
            return outputStream.toByteArray();

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to generate certificate PDF.",
                    exception
            );
        }
    }

    private void drawCenteredText(
            PDPageContentStream content,
            String text,
            PDType1Font font,
            float fontSize,
            float pageWidth,
            float y,
            Color color) throws IOException {

        float textWidth = font.getStringWidth(text) / 1000 * fontSize;
        float x = (pageWidth - textWidth) / 2;

        content.beginText();
        content.setFont(font, fontSize);
        content.setNonStrokingColor(color);
        content.newLineAtOffset(x, y);
        content.showText(text);
        content.endText();
    }

    // Standard PDF fonts support a limited character set.
    private String safeText(String value) {
        if (value == null) {
            return "";
        }

        return value.replaceAll("[^\\x20-\\x7E]", "?");
    }
}
