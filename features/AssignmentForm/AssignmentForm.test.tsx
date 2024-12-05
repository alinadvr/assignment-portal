import "@testing-library/jest-dom";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor, within } from "@testing-library/react";

import { server } from "@/mocks/node";

import AssignmentForm from ".";

// Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("All fields rendered correctly", () => {
  it("Renders name field", () => {
    render(<AssignmentForm />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
  });

  it("Renders email field", () => {
    render(<AssignmentForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });

  it("Renders description field", () => {
    render(<AssignmentForm />);

    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();
  });

  it("Renders gitHub_repo_url field", () => {
    render(<AssignmentForm />);

    expect(screen.getByLabelText(/GitHub Repo URL/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /.*github.*/i }),
    ).toBeInTheDocument();
  });

  it("Renders candidate level field", () => {
    render(<AssignmentForm />);

    expect(screen.getByLabelText(/select-label/i)).toHaveTextContent("Level");
    expect(screen.getByTestId("select-button")).toBeInTheDocument();
  });
});

describe("Validation errors displayed", () => {
  it("Validation errors name field", async () => {
    render(<AssignmentForm />);

    const input = screen.getByRole("textbox", { name: /name/i });

    await userEvent.type(input, "Test");

    expect(
      screen.queryByTestId(`input-name-helperText`),
    ).not.toBeInTheDocument();

    await userEvent.clear(input);

    expect(screen.getByTestId(`input-name-helperText`)).toHaveClass(
      "text-red-700",
    );
  });

  it("Validation errors email field", async () => {
    render(<AssignmentForm />);

    const input = screen.getByRole("textbox", { name: /email/i });

    await userEvent.type(input, "test");

    expect(screen.getByTestId(`input-email-helperText`)).toHaveClass(
      "text-red-700",
    );

    await userEvent.type(input, "test@test.io");

    expect(
      screen.queryByTestId(`input-email-helperText`),
    ).not.toBeInTheDocument();
  });

  it("Validation errors description field", async () => {
    render(<AssignmentForm />);

    const textarea = screen.getByRole("textbox", {
      name: /description/i,
    });

    await userEvent.type(textarea, "Test");

    expect(
      screen.getByTestId(`input-assignment-description-helperText`),
    ).toHaveClass("text-red-700");

    // min 10 symbols
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "1234567890");

    expect(
      screen.queryByTestId(`input-assignment-description-helperText`),
    ).not.toBeInTheDocument();
  });

  it("Validation errors gitHub_repo_url field", async () => {
    render(<AssignmentForm />);

    const input = screen.getByRole("textbox", { name: /github/i });

    await userEvent.type(input, "test");

    expect(screen.getByTestId(`input-github-repo-url-helperText`)).toHaveClass(
      "text-red-700",
    );

    await userEvent.type(input, "https://test.io");

    expect(
      screen.queryByTestId(`input-github-repo-url-helperText`),
    ).not.toBeInTheDocument();
  });
});

describe("Candidates level fetching", () => {
  it("Successfull candidates level fetching", async () => {
    render(<AssignmentForm />);

    const levelSelectButton = screen.getByTestId("select-button");
    const levelDropdown = screen.getByTestId("select-dropdown");

    act(() => levelSelectButton.click());

    await waitFor(() => screen.getByText(/junior/i));

    const levels = within(levelDropdown).getAllByRole("listitem");

    await userEvent.click(levels[0]);

    expect(screen.getByTestId("select-value")).toHaveTextContent(/junior/i);
  });

  it("Failed candidates level fetching", async () => {
    server.use(
      http.get(
        "https://tools.qa.public.ale.ai/api/tools/candidates/levels",
        () => {
          return new HttpResponse(null, { status: 500 });
        },
      ),
    );

    render(<AssignmentForm />);

    const levelSelectButton = screen.getByTestId("select-button");
    const levelDropdown = screen.getByTestId("select-dropdown");

    act(() => levelSelectButton.click());

    await waitFor(() => screen.getByText(/could not get options/i));

    const dropdownError = within(levelDropdown).getByRole("listitem");

    expect(dropdownError).toHaveClass(/text-red-600/i);
  });
});

describe("Submit button", () => {
  it("Renders submit button", () => {
    render(<AssignmentForm />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("Submit button disabled in init state", () => {
    render(<AssignmentForm />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("Submit button disabled when fields filled out incorrectly", async () => {
    render(<AssignmentForm />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const gitHubRepoUrlInput = screen.getByRole("textbox", {
      name: /description/i,
    });

    await userEvent.type(nameInput, "Test");
    await userEvent.type(emailInput, "Test");
    await userEvent.type(descriptionInput, "Test");
    await userEvent.type(gitHubRepoUrlInput, "Test");

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("Submit button enabled when fields filled out correctly", async () => {
    render(<AssignmentForm />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const gitHubRepoUrlInput = screen.getByRole("textbox", {
      name: /github/i,
    });
    const levelSelectButton = screen.getByTestId("select-button");
    const levelDropdown = screen.getByTestId("select-dropdown");

    await userEvent.type(nameInput, "Test");
    await userEvent.type(emailInput, "test@test.io");
    await userEvent.type(descriptionInput, "Test description");
    await userEvent.type(gitHubRepoUrlInput, "https://test.io");

    act(() => levelSelectButton.click());

    await waitFor(() => screen.getByText(/junior/i));

    const levels = within(levelDropdown).getAllByRole("listitem");

    await userEvent.click(levels[0]);

    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });

  it("Correct data upon form submission", async () => {
    render(<AssignmentForm />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const gitHubRepoUrlInput = screen.getByRole("textbox", {
      name: /github/i,
    });
    const levelSelectButton = screen.getByTestId("select-button");
    const levelDropdown = screen.getByTestId("select-dropdown");

    await userEvent.type(nameInput, "Test Name");
    await userEvent.type(emailInput, "test@test.io");
    await userEvent.type(descriptionInput, "Test description");
    await userEvent.type(gitHubRepoUrlInput, "https://test.io");

    act(() => levelSelectButton.click());

    await waitFor(() => screen.getByText(/junior/i));

    const levels = within(levelDropdown).getAllByRole("listitem");

    await userEvent.click(levels[0]);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(submitButton).toBeEnabled();

    submitButton.click();

    await waitFor(() => {
      const formData = JSON.parse(localStorage.getItem("form-data") || "{}");
      expect(formData).toEqual({
        Name: "Test Name",
        Email: "test@test.io",
        Description: "Test description",
        "GitHub Repo URL": "https://test.io",
        Level: "Junior",
      });
    });
  });
});
