/**
 * This file defines the PrContact type, which represents a public relations contact in the system. It includes properties such as id, outlet, language, contactName, email, contactType, location, bestPitch, summary, sourceUrl, isActive, createdAt, and updatedAt.
 *
 * The PrContact type is used throughout the application to ensure consistent handling of PR contact data, particularly when interacting with the database and API endpoints.
 *
 * @typedef {Object} PrContact
 * @property {number} id - The unique identifier for the PR contact.
 * @property {string} outlet - The media outlet associated with the PR contact.
 * @property {string|null} language - The preferred language of the PR contact, if applicable.
 * @property {string|null} contactName - The name of the PR contact person.
 * @property {string|null} email - The email address of the PR contact.
 * @property {string|null} contactType - The type of contact (e.g., journalist, blogger).
 * @property {string|null} location - The geographical location of the PR contact.
 * @property {string|null} bestPitch - A brief description of the best pitch for this contact.
 * @property {string|null} summary - A summary of the PR contact's profile or background.
 * @property {string|null} sourceUrl - The URL to the source of the PR contact information.
 * @property {boolean} isActive - Indicates whether the PR contact is currently active.
 * @property {string} createdAt - The timestamp when the PR contact was created.
 * @property {string} updatedAt - The timestamp when the PR contact was last updated.
 */
export type PrContact = {
    id: number;
    outlet: string;
    language: string | null;
    contactName: string | null;
    email: string | null;
    contactType: string | null;
    location: string | null;
    bestPitch: string | null;
    summary: string | null;
    sourceUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};