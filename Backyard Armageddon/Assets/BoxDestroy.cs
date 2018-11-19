using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BoxDestroy : MonoBehaviour
{

    public int health;
    public float spriteBlinkingTimer = 0.0f;
    public float spriteBlinkingMiniDuration = 0.1f;
    public float spriteBlinkingTotalTimer = 0.0f;
    public float spriteBlinkingTotalDuration = 1.0f;
    public bool startBlinking = false;

    private void Start()
    {
        GetComponent<Animator>().enabled = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (health <= 0)
        {
            GetComponent<Animator>().enabled = true;
            GetComponent<BoxCollider2D>().isTrigger = true;
            GetComponent<SpriteRenderer>().enabled = true;
            startBlinking = false;
        }


        if (startBlinking == true && health > 0)
        {
            SpriteBlinkingEffect();
        }

    }

    public void DestroyBox(bool hasTheTool)
    {
        if(hasTheTool) {
            health = -1;
        }
        
    }

    private void SpriteBlinkingEffect()
    {
        spriteBlinkingTotalTimer += Time.deltaTime;
        if (spriteBlinkingTotalTimer >= spriteBlinkingTotalDuration)
        {
            startBlinking = false;
            spriteBlinkingTotalTimer = 0.0f;
            GetComponent<SpriteRenderer>().enabled = true;   // according to 
                                                             //your sprite
            return;
        }

        spriteBlinkingTimer += Time.deltaTime;
        if (spriteBlinkingTimer >= spriteBlinkingMiniDuration)
        {
            spriteBlinkingTimer = 0.0f;
            if (GetComponent<SpriteRenderer>().enabled == true)
            {
                GetComponent<SpriteRenderer>().enabled = false;  //make changes
            }
            else
            {
                GetComponent<SpriteRenderer>().enabled = true;   //make changes
            }
        }
    }
}
