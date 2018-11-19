using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{

    public int health;
    private bool isAttacking = false;
    public float spriteBlinkingTimer = 0.0f;
    public float spriteBlinkingMiniDuration = 0.1f;
    public float spriteBlinkingTotalTimer = 0.0f;
    public float spriteBlinkingTotalDuration = 1.0f;
    public bool startBlinking = false;


    // Update is called once per frame
    void Update()
    {
        if (health <= 0)
        {
            if (gameObject.tag != "Box")
            {
                GetComponent<EnemyMovement>().SetSpeed(0);
            }
            GetComponent<Animator>().SetBool("Death", true);
            GetComponent<BoxCollider2D>().isTrigger = true;
            GetComponent<SpriteRenderer>().enabled = true;
            startBlinking = false;
        }

        if (isAttacking && gameObject.tag != "Box")
        {
            GetComponent<Animator>().SetTrigger("Attack");
        }

        if (startBlinking == true && health > 0)
        {
            SpriteBlinkingEffect();
        }

    }

    public void TakeDamage(int damage)
    {
        health -= damage;
        startBlinking = true;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.collider.CompareTag("Player"))
        {
            isAttacking = true;
        }
    }

    private void OnCollisionExit2D(Collision2D collision)
    {
        isAttacking = false;
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
