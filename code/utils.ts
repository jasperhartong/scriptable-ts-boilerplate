async function getSecret(): Promise<string | undefined> {
    let secret = args.widgetParameter;

    if (!secret) {
        const alert = new Alert();
        alert.title = "Please fill in your secret";
        alert.message = "The secret can also be filled in the parameter field of the widget settings (tap on widget in wiggle mode)";
        alert.addSecureTextField("secret")
        alert.addAction("Done")
        await alert.presentAlert()
        secret = alert.textFieldValue(0)
    }
    return secret;
}

export { getSecret };

