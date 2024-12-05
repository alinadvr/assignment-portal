import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import SubmittedData from ".";

describe("SubmittedData Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Displays a message when no form data is submitted", () => {
    render(<SubmittedData />);

    expect(
      screen.getByText(/You have not submitted form yet/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument();
  });

  it("Displays the submitted data correctly from localStorage", () => {
    const mockFormData = {
      Name: "John Doe",
      Email: "john@example.com",
      "GitHub Repo URL": "https://github.com/johndoe",
      Level: "Junior",
    };

    localStorage.setItem("form-data", JSON.stringify(mockFormData));

    render(<SubmittedData />);

    expect(
      screen.getByText(/Thank you for submitting the form!/i),
    ).toBeInTheDocument();

    Object.entries(mockFormData).forEach(([key, value]) => {
      expect(screen.getByText(`${key}: ${value}`)).toBeInTheDocument();
    });
  });
});
