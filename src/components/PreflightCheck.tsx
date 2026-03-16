import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { API_URL, validatedFetch } from "@/lib/api";

interface PreflightCheckProps {
    onSuccess: () => void;
    children?: React.ReactNode;
}

const PreflightCheck = ({ onSuccess, children }: PreflightCheckProps) => {
    const [status, setStatus] = useState<"checking" | "challenge" | "success" | "error">("checking");
    const [errorMessage, setErrorMessage] = useState("");

    const checkConnectivity = async () => {
        setStatus("checking");
        try {
            // Try to fetch a simple endpoint to verify WAF status
            const response = await validatedFetch(`${API_URL}/stations`);
            if (response.ok) {
                setStatus("success");
                onSuccess();
            } else {
                throw new Error("API_UNAVAILABLE");
            }
        } catch (err: any) {
            if (err.message === "WAF_CHALLENGE_DETECTED") {
                setStatus("challenge");
            } else {
                setStatus("error");
                setErrorMessage(err.message || "Failed to connect to the server");
            }
        }
    };

    useEffect(() => {
        checkConnectivity();
    }, []);

    const handleVerify = () => {
        // On iOS, sometimes a direct navigation helps clear the challenge
        // Or we just try to fetch again on user interaction
        checkConnectivity();
    };

    const handleOpenDirectly = () => {
        // Opening the API URL directly in a new tab to let the user solve the CAPTCHA
        window.open(`${API_URL}/stations`, "_blank");
    };

    if (status === "success") {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-3xl border border-border shadow-2xl max-w-md mx-auto my-12 text-center animate-fade-in">
            {status === "checking" && (
                <>
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-bold mb-2">Verifying Connection</h3>
                    <p className="text-muted-foreground italic text-sm">Working through secure channels...</p>
                </>
            )}

            {status === "challenge" && (
                <>
                    <ShieldCheck className="w-16 h-16 text-amber-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Security Verification</h3>
                    <p className="text-muted-foreground mb-6">
                        Our hosting provider requires a quick security check to ensure you're not a bot.
                        This is common on iOS Safari.
                    </p>
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={handleVerify}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            Tap to Verify
                        </button>
                        <button
                            onClick={handleOpenDirectly}
                            className="text-sm text-primary underline hover:text-primary/80"
                        >
                            Still stuck? Try opening the check directly
                        </button>
                    </div>
                </>
            )}

            {status === "error" && (
                <>
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Connectivity Error</h3>
                    <p className="text-muted-foreground mb-6">{errorMessage}</p>
                    <button
                        onClick={handleVerify}
                        className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold"
                    >
                        Retry Connection
                    </button>
                </>
            )}
        </div>
    );
};

export default PreflightCheck;
