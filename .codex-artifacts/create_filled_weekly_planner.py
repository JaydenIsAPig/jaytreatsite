from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas


SOURCE = Path(
    "/Users/jayden/Desktop/Pima/MAT_097RQ/Time Management.html/"
    "Included Files/Weekly Planner.pdf"
)
OUTPUT = Path(
    "/Users/jayden/Desktop/jaycode/jaytreatsite/Filled Weekly Planner.pdf"
)

PAGE_WIDTH = 612
PAGE_HEIGHT = 792

# Column bounds measured from the original letter-size PDF.
BIG_ROCKS = (126.7, 255.8)
PEBBLES = (255.8, 397.4)
TABLE_TOP = 681.1
DAY_HEIGHT = 87.8


SCHEDULE = [
    {
        "rocks": ["Morning", "Pima Classes", "Night"],
        "pebbles": [
            "7:00-7:45  Workout",
            "8:00-8:30  Coffee & breakfast",
            "9:00-10:30  Study assignments",
            "12:00-1:00  Lunch & class prep",
            "2:15-5:05  Pima classes",
            "7:00-10:00  Chill time",
        ],
    },
    {
        "rocks": ["Morning", "Pima Classes", "Night"],
        "pebbles": [
            "6:45-7:30  Workout",
            "7:45-8:15  Coffee & breakfast",
            "9:30-11:00  Homework",
            "12:30-1:30  Lunch & commute",
            "2:15-5:05  Pima classes",
            "7:30-10:00  Chill time",
        ],
    },
    {
        "rocks": ["Morning", "Pima Classes", "Night"],
        "pebbles": [
            "7:15-8:00  Workout",
            "8:10-8:40  Coffee & breakfast",
            "9:00-10:00  Review notes",
            "12:00-1:15  Lunch & errands",
            "2:15-5:05  Pima classes",
            "7:00-9:30  Chill time",
        ],
    },
    {
        "rocks": ["Morning", "Pima Classes", "Night"],
        "pebbles": [
            "6:30-7:15  Workout",
            "7:30-8:00  Coffee & breakfast",
            "9:00-11:00  Finish assignments",
            "12:15-1:30  Lunch & class prep",
            "2:15-5:05  Pima classes",
            "7:30-10:00  Chill time",
        ],
    },
    {
        "rocks": ["Morning", "Work", "Night"],
        "pebbles": [
            "6:45-7:30  Workout",
            "7:40-8:10  Coffee & breakfast",
            "8:15-8:45  Get ready",
            "9:00-5:00  Work shift",
            "5:30-6:30  Dinner",
            "7:00-10:30  Movie & chill",
        ],
    },
    {
        "rocks": ["Morning", "Work", "Night"],
        "pebbles": [
            "7:30-8:15  Workout",
            "8:20-9:00  Coffee & breakfast",
            "9:00-9:30  Get ready",
            "10:00-4:00  Work shift",
            "4:30-6:00  Groceries & dinner",
            "7:00-11:00  Friends & chill",
        ],
    },
    {
        "rocks": ["Morning", "Work", "Night"],
        "pebbles": [
            "8:00-8:45  Light workout",
            "9:00-9:30  Coffee & breakfast",
            "9:30-10:00  Plan the week",
            "10:30-3:30  Work shift",
            "4:00-5:30  Laundry & meal prep",
            "7:00-9:30  Relax & early night",
        ],
    },
]


def centered_text(pdf, text, bounds, y, font_size=9):
    left, right = bounds
    pdf.setFont("Helvetica", font_size)
    width = pdf.stringWidth(text, "Helvetica", font_size)
    pdf.drawString(left + (right - left - width) / 2, y, text)


def build_overlay():
    packet = BytesIO()
    pdf = canvas.Canvas(packet, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    pdf.setFillColorRGB(0.05, 0.05, 0.05)

    pdf.setFont("Helvetica", 10)
    pdf.drawString(120, 713, "June 8-14, 2026")

    for day_index, day in enumerate(SCHEDULE):
        day_top = TABLE_TOP - day_index * DAY_HEIGHT

        for rock_index, rock in enumerate(day["rocks"]):
            row_center = day_top - (rock_index + 0.5) * (DAY_HEIGHT / 3)
            centered_text(pdf, rock, BIG_ROCKS, row_center - 3.2, 8.5)

        pebble_row_height = DAY_HEIGHT / 6
        for pebble_index, pebble in enumerate(day["pebbles"]):
            row_center = day_top - (pebble_index + 0.5) * pebble_row_height
            pdf.setFont("Helvetica", 6.7)
            pdf.drawString(PEBBLES[0] + 4, row_center - 2.4, pebble)

    pdf.save()
    packet.seek(0)
    return packet


def main():
    source = PdfReader(str(SOURCE))
    overlay = PdfReader(build_overlay())
    source.pages[0].merge_page(overlay.pages[0])

    writer = PdfWriter()
    writer.add_page(source.pages[0])
    with OUTPUT.open("wb") as output_file:
        writer.write(output_file)

    print(OUTPUT)


if __name__ == "__main__":
    main()
